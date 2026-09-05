import { useEffect, useRef, useState } from 'react';
import { MapContainer, TileLayer, Marker, useMapEvents, useMap } from 'react-leaflet';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import {
  Info,
  DollarSign,
  MapPin,
  ListChecks,
  Image as ImageIcon,
  Eye,
  ChevronLeft,
  ChevronRight,
  UploadCloud,
  X,
  Save,
  Rocket,
  Loader2,
} from 'lucide-react';
import { getCategories } from '../../services/category.service';
import {
  createProperty,
  updateProperty,
  uploadPropertyImages,
} from '../../services/property.service';

const AMENITIES = [
  'Parking',
  'Wi-Fi',
  'Swimming Pool',
  'Gym',
  'Balcony',
  'Elevator',
  'Furnished',
  'Garden',
  'Air Conditioning',
  'Security System',
  'Backup Power',
  'Water Tank',
];

const DEFAULT_CENTER = [9.03, 38.74];
const MAX_IMAGES = 10;

const steps = [
  { key: 'basic', label: 'Basic Info', icon: Info },
  { key: 'pricing', label: 'Pricing', icon: DollarSign },
  { key: 'location', label: 'Location', icon: MapPin },
  { key: 'details', label: 'Details', icon: ListChecks },
  { key: 'media', label: 'Media', icon: ImageIcon },
  { key: 'review', label: 'Review', icon: Eye },
];

const getApiError = (err) => {
  const errors = Array.isArray(err?.errors) ? err.errors : [];
  const message = err?.message || '';
  if (!message) {
    return 'Something went wrong. Please try again.';
  }
  return errors.length ? `${message}: ${errors.join(', ')}` : message;
};

const numberOrUndefined = (value) => {
  if (value === null || value === undefined || String(value).trim() === '') {
    return undefined;
  }
  const parsed = Number(value);
  return Number.isNaN(parsed) ? undefined : parsed;
};

const MapClickHandler = ({ onPick }) => {
  useMapEvents({
    click(event) {
      const { lat, lng } = event.latlng;
      onPick({ latitude: Number(lat.toFixed(7)), longitude: Number(lng.toFixed(7)) });
    },
  });
  return null;
};

const pinIcon = L.divIcon({
  className: '',
  html:
    '<div style="width:34px;height:34px;display:flex;align-items:center;justify-content:center;background:#4A9FF5;border:3px solid #fff;border-radius:50% 50% 50% 0;transform:rotate(-45deg);box-shadow:0 3px 8px rgba(0,0,0,0.35)"></div>',
  iconSize: [34, 34],
  iconAnchor: [17, 34],
});

const MAX_IMAGE_BYTES = 5 * 1024 * 1024;
const ACCEPTED_IMAGE_TYPES = ['image/jpeg', 'image/png', 'image/webp'];

const MapCenterSync = ({ position }) => {
  const map = useMap();
  const lastPositionRef = useRef(position);

  useEffect(() => {
    const [lat, lng] = position;
    const [prevLat, prevLng] = lastPositionRef.current;
    if (lat !== prevLat || lng !== prevLng) {
      lastPositionRef.current = position;
      map.setView(position, map.getZoom());
    }
  }, [position, map]);

  return null;
};

const MapPicker = ({ latitude, longitude, onChange }) => {
  const hasStoredCoords = latitude != null && longitude != null;
  const [position, setPosition] = useState(
    hasStoredCoords ? [latitude, longitude] : DEFAULT_CENTER,
  );
  const [prevCoords, setPrevCoords] = useState([latitude, longitude]);

  if (
    hasStoredCoords &&
    (latitude !== prevCoords?.[0] || longitude !== prevCoords?.[1])
  ) {
    setPrevCoords([latitude, longitude]);
    setPosition([latitude, longitude]);
  }

  const handlePick = (coords) => {
    if (coords?.latitude != null && coords?.longitude != null) {
      setPosition([coords.latitude, coords.longitude]);
    }
    onChange(coords);
  };

  return (
    <div className="rounded-xl overflow-hidden border border-[#D5DDE0]">
      <MapContainer
        center={[position[0], position[1]]}
        zoom={12}
        scrollWheelZoom={false}
        className="w-full h-[300px] z-0"
      >
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          maxZoom={19}
        />
        <MapCenterSync position={position} />
        <MapClickHandler onPick={handlePick} />
        <Marker
          position={[position[0], position[1]]}
          icon={pinIcon}
          draggable
          eventHandlers={{
            dragend(event) {
              const { lat, lng } = event.target.getLatLng();
              handlePick({ latitude: Number(lat.toFixed(7)), longitude: Number(lng.toFixed(7)) });
            },
          }}
        />
      </MapContainer>
      <p className="text-xs text-slate-500 bg-white px-3 py-2 flex items-center space-x-1.5">
        <MapPin size={13} className="text-[#4A9FF5]" />
        <span>Click the map or drag the pin to set the exact location.</span>
      </p>
    </div>
  );
};

const PropertyForm = ({ initial, onSaved, onCancel }) => {
  const isEdit = Boolean(initial);
  const [categories, setCategories] = useState([]);
  const [categoriesError, setCategoriesError] = useState('');

  const [step, setStep] = useState(0);
  const [errors, setErrors] = useState({});
  const [submitting, setSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState('');

  const [form, setForm] = useState(() => ({
    title: initial?.title || '',
    description: initial?.description || '',
    listingType: initial?.listingType || 'sale',
    categoryId: initial?.categoryId || '',
    price: initial?.price != null ? String(initial.price) : '',
    area: initial?.area != null ? String(initial.area) : '',
    bedrooms: initial?.bedrooms != null ? String(initial.bedrooms) : '',
    bathrooms: initial?.bathrooms != null ? String(initial.bathrooms) : '',
    parkingSpaces: initial?.parkingSpaces != null ? String(initial.parkingSpaces) : '',
    country: initial?.country || '',
    city: initial?.city || '',
    address: initial?.address || '',
    latitude: initial?.latitude != null ? String(initial.latitude) : '',
    longitude: initial?.longitude != null ? String(initial.longitude) : '',
  }));

  const [amenities, setAmenities] = useState(initial?.amenities || []);
  const [existingImages] = useState(initial?.images || []);
  const [pendingImages, setPendingImages] = useState([]);
  const [sizeRejection, setSizeRejection] = useState(0);
  const previewUrlsRef = useRef([]);

  useEffect(() => {
    getCategories()
      .then((data) => setCategories(data))
      .catch(() => setCategoriesError('Failed to load categories. Please refresh the page.'));
  }, []);

  useEffect(
    () => () => {
      previewUrlsRef.current.forEach((url) => URL.revokeObjectURL(url));
    },
    [],
  );

  useEffect(() => {
    if (!sizeRejection) return undefined;
    const timer = setTimeout(() => setSizeRejection(0), 5000);
    return () => clearTimeout(timer);
  }, [sizeRejection]);

  const setField = (name, value) => {
    setForm((prev) => ({ ...prev, [name]: value }));
    setErrors((prev) => ({ ...prev, [name]: '' }));
  };

  const toggleAmenity = (name) => {
    setAmenities((prev) => (prev.includes(name) ? prev.filter((a) => a !== name) : [...prev, name]));
  };

  const addPendingImages = (fileList) => {
    const accepted = Array.from(fileList).filter((file) => ACCEPTED_IMAGE_TYPES.includes(file.type));
    const oversized = accepted.filter((file) => file.size > MAX_IMAGE_BYTES);
    const withinLimit = accepted.filter((file) => file.size <= MAX_IMAGE_BYTES);
    const room = MAX_IMAGES - existingImages.length - pendingImages.length;
    const budget = withinLimit.slice(0, Math.max(0, room));

    const withPreviews = budget.map((file) => {
      const preview = URL.createObjectURL(file);
      previewUrlsRef.current.push(preview);
      return { file, preview };
    });

    setPendingImages((prev) => [...prev, ...withPreviews]);

    if (oversized.length) setSizeRejection(oversized.length);

    return { rejectedSize: oversized.length };
  };

  const removePendingImage = (previewUrl) => {
    URL.revokeObjectURL(previewUrl);
    previewUrlsRef.current = previewUrlsRef.current.filter((url) => url !== previewUrl);
    setPendingImages((prev) => prev.filter((img) => img.preview !== previewUrl));
  };

  const updateCoords = ({ latitude, longitude }) => {
    setField('latitude', latitude != null ? String(latitude) : '');
    setField('longitude', longitude != null ? String(longitude) : '');
    setErrors((prev) => ({ ...prev, latitude: '', longitude: '' }));
  };

  const validateStep = (stepIndex) => {
    const nextErrors = {};
    const push = (key, message) => {
      nextErrors[key] = message;
    };

    if (stepIndex === 0) {
      if (!form.title.trim()) push('title', 'Title is required');
      else if (form.title.trim().length < 3) push('title', 'Title must be at least 3 characters');
      if (!form.description.trim()) push('description', 'Description is required');
      if (!form.listingType) push('listingType', 'Select a listing type');
      if (!form.categoryId) push('categoryId', 'Select a category');
    }

    if (stepIndex === 1) {
      const price = numberOrUndefined(form.price);
      if (price === undefined || price <= 0) push('price', 'Enter a price greater than zero');
      const area = numberOrUndefined(form.area);
      if (area !== undefined && area <= 0) push('area', 'Area must be greater than zero');
    }

    if (stepIndex === 2) {
      if (!form.country.trim()) push('country', 'Country is required');
      if (!form.city.trim()) push('city', 'City is required');
      const latitude = Number(form.latitude);
      const longitude = Number(form.longitude);
      if (form.latitude !== '' && (Number.isNaN(latitude) || latitude < -90 || latitude > 90)) {
        push('latitude', 'Latitude must be between -90 and 90');
      }
      if (form.longitude !== '' && (Number.isNaN(longitude) || longitude < -180 || longitude > 180)) {
        push('longitude', 'Longitude must be between -180 and 180');
      }
    }

    if (stepIndex === 3) {
      ['bedrooms', 'bathrooms', 'parkingSpaces'].forEach((field) => {
        const value = numberOrUndefined(form[field]);
        if (value !== undefined && (!Number.isInteger(value) || value < 0)) {
          push(field, 'Must be a positive whole number');
        }
      });
    }

    return nextErrors;
  };

  const handleNext = () => {
    const stepErrors = validateStep(step);
    if (Object.keys(stepErrors).length > 0) {
      setErrors((prev) => ({ ...prev, ...stepErrors }));
      return;
    }
    setErrors({});
    setStep((prev) => Math.min(prev + 1, steps.length - 1));
  };

  const handleBack = () => setStep((prev) => Math.max(prev - 1, 0));

  const buildPayload = (pressedStatus) => {
  const existingStatus = isEdit ? initial?.status : undefined;
  const preserveStatus =
    isEdit && existingStatus && existingStatus !== 'draft' && existingStatus !== 'available';
  return {
    title: form.title.trim(),
    description: form.description.trim(),
    listingType: form.listingType,
    categoryId: Number(form.categoryId),
    price: numberOrUndefined(form.price),
    area: numberOrUndefined(form.area),
    bedrooms: numberOrUndefined(form.bedrooms),
    bathrooms: numberOrUndefined(form.bathrooms),
    parkingSpaces: numberOrUndefined(form.parkingSpaces),
    country: form.country.trim(),
    city: form.city.trim(),
    address: form.address.trim() || undefined,
    latitude: numberOrUndefined(form.latitude),
    longitude: numberOrUndefined(form.longitude),
    status: preserveStatus ? existingStatus : pressedStatus,
    amenities: amenities.length ? amenities : undefined,
  };
};

  const handleSave = async (status) => {
    let allInvalid = {};
    let firstInvalid = steps.length - 1;
    steps.forEach((_, i) => {
      if (i < steps.length - 1) {
        const stepErrors = validateStep(i);
        allInvalid = { ...allInvalid, ...stepErrors };
        if (Object.keys(stepErrors).length > 0 && i < firstInvalid) {
          firstInvalid = i;
        }
      }
    });

    if (Object.keys(allInvalid).length > 0) {
      setErrors(allInvalid);
      setStep(Math.max(firstInvalid, 0));
      return;
    }

    setSubmitting(true);
    setSubmitError('');
    let uploadNotice = null;
    try {
      const payload = buildPayload(status);
      let propertyId;
      if (isEdit) {
        await updateProperty(initial.id, payload);
        propertyId = initial.id;
      } else {
        const created = await createProperty(payload);
        propertyId = created.id;
      }

      if (pendingImages.length) {
        try {
          await uploadPropertyImages(propertyId, pendingImages.map((image) => image.file));
        } catch (uploadErr) {
          const action = status === 'draft' ? 'Draft saved' : 'Published';
          uploadNotice = `${action}, but image upload failed: ${getApiError(uploadErr)}. Add images later from Edit Property.`;
        }
      }

      onSaved(status, uploadNotice);
    } catch (err) {
      setSubmitError(getApiError(err));
    } finally {
      setSubmitting(false);
    }
  };

  const totalImages = existingImages.length + pendingImages.length;
  const maxReached = totalImages >= MAX_IMAGES;

  const renderStepContent = () => {
    switch (step) {
      case 0:
        return (
          <div className="space-y-5">
            <div>
              <label htmlFor="title" className="text-[13px] font-semibold text-[#101820]">
                Property Title
              </label>
              <input
                id="title"
                value={form.title}
                onChange={(e) => setField('title', e.target.value)}
                placeholder="e.g. Sunny 3BR Apartment in Bole"
                className="mt-1.5 w-full rounded-lg border bg-white px-3.5 py-2.5 text-[13px] outline-none transition-colors focus:border-[#4A9FF5] focus:ring-2 focus:ring-[#4A9FF5]/20"
                style={{ borderColor: errors.title ? '#E5484D' : '#D5DDE0' }}
              />
              {errors.title && <p className="mt-1 text-xs text-[#E5484D]">{errors.title}</p>}
            </div>

            <div>
              <span className="text-[13px] font-semibold text-[#101820]">Listing Type</span>
              <div className="mt-1.5 grid grid-cols-2 gap-3">
                {[
                  { value: 'sale', label: 'For Sale' },
                  { value: 'rent', label: 'For Rent' },
                ].map((option) => (
                  <button
                    key={option.value}
                    type="button"
                    onClick={() => setField('listingType', option.value)}
                    className={`h-11 rounded-lg border text-[13px] font-semibold transition cursor-pointer ${
                      form.listingType === option.value
                        ? 'border-[#4A9FF5] bg-[#4A9FF5]/10 text-[#1f6fd0]'
                        : 'border-[#D5DDE0] bg-white text-slate-600 hover:border-slate-300'
                    }`}
                  >
                    {option.label}
                  </button>
                ))}
              </div>
              {errors.listingType && <p className="mt-1 text-xs text-[#E5484D]">{errors.listingType}</p>}
            </div>

            <div>
              <label htmlFor="categoryId" className="text-[13px] font-semibold text-[#101820]">
                Category
              </label>
              {categoriesError ? (
                <p className="mt-1.5 text-xs text-amber-600">{categoriesError}</p>
              ) : (
                <select
                  id="categoryId"
                  value={form.categoryId}
                  onChange={(e) => setField('categoryId', e.target.value)}
                  className="mt-1.5 w-full rounded-lg border bg-white px-3 py-2.5 text-[13px] outline-none transition-colors focus:border-[#4A9FF5] focus:ring-2 focus:ring-[#4A9FF5]/20"
                  style={{ borderColor: errors.categoryId ? '#E5484D' : '#D5DDE0' }}
                >
                  <option value="">Select a category...</option>
                  {categories.map((category) => (
                    <option key={category.id} value={category.id}>
                      {category.name}
                    </option>
                  ))}
                </select>
              )}
              {errors.categoryId && <p className="mt-1 text-xs text-[#E5484D]">{errors.categoryId}</p>}
            </div>

            <div>
              <label htmlFor="description" className="text-[13px] font-semibold text-[#101820]">
                Description
              </label>
              <textarea
                id="description"
                value={form.description}
                onChange={(e) => setField('description', e.target.value)}
                rows={4}
                placeholder="Describe the property — condition, neighborhood, highlights..."
                className="mt-1.5 w-full resize-y rounded-lg border bg-white px-3.5 py-2.5 text-[13px] outline-none transition-colors focus:border-[#4A9FF5] focus:ring-2 focus:ring-[#4A9FF5]/20"
                style={{ borderColor: errors.description ? '#E5484D' : '#D5DDE0' }}
              />
              {errors.description && <p className="mt-1 text-xs text-[#E5484D]">{errors.description}</p>}
            </div>
          </div>
        );

      case 1:
        return (
          <div className="space-y-5">
            <div>
              <label htmlFor="price" className="text-[13px] font-semibold text-[#101820]">
                Price (Br)
              </label>
              <input
                id="price"
                type="number"
                min="0"
                step="0.01"
                value={form.price}
                onChange={(e) => setField('price', e.target.value)}
                placeholder="e.g. 150000"
                className="mt-1.5 w-full rounded-lg border bg-white px-3.5 py-2.5 text-[13px] outline-none transition-colors focus:border-[#4A9FF5] focus:ring-2 focus:ring-[#4A9FF5]/20"
                style={{ borderColor: errors.price ? '#E5484D' : '#D5DDE0' }}
              />
              {errors.price && <p className="mt-1 text-xs text-[#E5484D]">{errors.price}</p>}
            </div>

            <div>
              <label htmlFor="area" className="text-[13px] font-semibold text-[#101820]">
                Area (m²) — optional
              </label>
              <input
                id="area"
                type="number"
                min="0"
                step="0.01"
                value={form.area}
                onChange={(e) => setField('area', e.target.value)}
                placeholder="e.g. 120"
                className="mt-1.5 w-full rounded-lg border bg-white px-3.5 py-2.5 text-[13px] outline-none transition-colors focus:border-[#4A9FF5] focus:ring-2 focus:ring-[#4A9FF5]/20"
                style={{ borderColor: errors.area ? '#E5484D' : '#D5DDE0' }}
              />
              {errors.area && <p className="mt-1 text-xs text-[#E5484D]">{errors.area}</p>}
            </div>

            <div className="rounded-xl bg-sky-50 border border-sky-100 px-4 py-3 text-xs text-sky-800">
              Pricing information is shown on your public listing. You can change it anytime.
            </div>
          </div>
        );

      case 2:
        return (
          <div className="space-y-5">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label htmlFor="country" className="text-[13px] font-semibold text-[#101820]">
                  Country
                </label>
                <input
                  id="country"
                  value={form.country}
                  onChange={(e) => setField('country', e.target.value)}
                  placeholder="e.g. Ethiopia"
                  className="mt-1.5 w-full rounded-lg border bg-white px-3.5 py-2.5 text-[13px] outline-none transition-colors focus:border-[#4A9FF5] focus:ring-2 focus:ring-[#4A9FF5]/20"
                  style={{ borderColor: errors.country ? '#E5484D' : '#D5DDE0' }}
                />
                {errors.country && <p className="mt-1 text-xs text-[#E5484D]">{errors.country}</p>}
              </div>
              <div>
                <label htmlFor="city" className="text-[13px] font-semibold text-[#101820]">
                  City
                </label>
                <input
                  id="city"
                  value={form.city}
                  onChange={(e) => setField('city', e.target.value)}
                  placeholder="e.g. Addis Ababa"
                  className="mt-1.5 w-full rounded-lg border bg-white px-3.5 py-2.5 text-[13px] outline-none transition-colors focus:border-[#4A9FF5] focus:ring-2 focus:ring-[#4A9FF5]/20"
                  style={{ borderColor: errors.city ? '#E5484D' : '#D5DDE0' }}
                />
                {errors.city && <p className="mt-1 text-xs text-[#E5484D]">{errors.city}</p>}
              </div>
            </div>

            <div>
              <label htmlFor="address" className="text-[13px] font-semibold text-[#101820]">
                Address — optional
              </label>
              <input
                id="address"
                value={form.address}
                onChange={(e) => setField('address', e.target.value)}
                placeholder="e.g. Bole Road, near Friendship Building"
                className="mt-1.5 w-full rounded-lg border bg-white px-3.5 py-2.5 text-[13px] outline-none transition-colors focus:border-[#4A9FF5] focus:ring-2 focus:ring-[#4A9FF5]/20"
                style={{ borderColor: errors.address ? '#E5484D' : '#D5DDE0' }}
              />
            </div>

            <MapPicker
              latitude={numberOrUndefined(form.latitude)}
              longitude={numberOrUndefined(form.longitude)}
              onChange={updateCoords}
            />

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label htmlFor="latitude" className="text-[13px] font-semibold text-[#101820]">
                  Latitude
                </label>
                <input
                  id="latitude"
                  type="number"
                  step="any"
                  value={form.latitude}
                  onChange={(e) => setField('latitude', e.target.value)}
                  placeholder="e.g. 9.03"
                  className="mt-1.5 w-full rounded-lg border bg-white px-3.5 py-2.5 text-[13px] outline-none transition-colors focus:border-[#4A9FF5] focus:ring-2 focus:ring-[#4A9FF5]/20"
                  style={{ borderColor: errors.latitude ? '#E5484D' : '#D5DDE0' }}
                />
                {errors.latitude && <p className="mt-1 text-xs text-[#E5484D]">{errors.latitude}</p>}
              </div>
              <div>
                <label htmlFor="longitude" className="text-[13px] font-semibold text-[#101820]">
                  Longitude
                </label>
                <input
                  id="longitude"
                  type="number"
                  step="any"
                  value={form.longitude}
                  onChange={(e) => setField('longitude', e.target.value)}
                  placeholder="e.g. 38.74"
                  className="mt-1.5 w-full rounded-lg border bg-white px-3.5 py-2.5 text-[13px] outline-none transition-colors focus:border-[#4A9FF5] focus:ring-2 focus:ring-[#4A9FF5]/20"
                  style={{ borderColor: errors.longitude ? '#E5484D' : '#D5DDE0' }}
                />
                {errors.longitude && <p className="mt-1 text-xs text-[#E5484D]">{errors.longitude}</p>}
              </div>
            </div>
          </div>
        );

      case 3:
        return (
          <div className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {[
                { key: 'bedrooms', label: 'Bedrooms' },
                { key: 'bathrooms', label: 'Bathrooms' },
                { key: 'parkingSpaces', label: 'Parking Spaces' },
              ].map((field) => (
                <div key={field.key}>
                  <label htmlFor={field.key} className="text-[13px] font-semibold text-[#101820]">
                    {field.label}
                  </label>
                  <input
                    id={field.key}
                    type="number"
                    min="0"
                    step="1"
                    value={form[field.key]}
                    onChange={(e) => setField(field.key, e.target.value)}
                    className="mt-1.5 w-full rounded-lg border bg-white px-3.5 py-2.5 text-[13px] outline-none transition-colors focus:border-[#4A9FF5] focus:ring-2 focus:ring-[#4A9FF5]/20"
                    style={{ borderColor: errors[field.key] ? '#E5484D' : '#D5DDE0' }}
                  />
                  {errors[field.key] && (
                    <p className="mt-1 text-xs text-[#E5484D]">{errors[field.key]}</p>
                  )}
                </div>
              ))}
            </div>

            <div>
              <span className="text-[13px] font-semibold text-[#101820]">Amenities</span>
              <p className="text-xs text-slate-500 mt-0.5 mb-2.5">Select everything the property offers.</p>
              <div className="grid grid-cols-2 md:grid-cols-3 gap-2.5">
                {AMENITIES.map((amenity) => {
                  const selected = amenities.includes(amenity);
                  return (
                    <button
                      key={amenity}
                      type="button"
                      onClick={() => toggleAmenity(amenity)}
                      className={`h-10 px-3 rounded-lg border text-[13px] font-medium text-left transition cursor-pointer ${
                        selected
                          ? 'border-[#4A9FF5] bg-[#4A9FF5]/10 text-[#1f6fd0]'
                          : 'border-[#D5DDE0] bg-white text-slate-600 hover:border-slate-300'
                      }`}
                      aria-pressed={selected}
                    >
                      <span className="flex items-center space-x-2">
                        <span
                          className={`w-4 h-4 rounded flex items-center justify-center border text-[10px] font-bold ${
                            selected
                              ? 'bg-[#4A9FF5] border-[#4A9FF5] text-white'
                              : 'border-slate-300 text-transparent'
                          }`}
                        >
                          ✓
                        </span>
                        <span className="truncate">{amenity}</span>
                      </span>
                    </button>
                  );
                })}
              </div>
            </div>
          </div>
        );

      case 4:
        return (
          <div className="space-y-5">
            {sizeRejection > 0 && (
              <p
                role="alert"
                className="rounded-lg border border-amber-200 bg-amber-50 px-3 py-2 text-[12px] text-amber-800"
              >
                {sizeRejection === 1
                  ? '1 image was skipped because it exceeds 5MB.'
                  : `${sizeRejection} images were skipped because each exceeds 5MB.`}
              </p>
            )}
            <div
              onDragOver={(e) => e.preventDefault()}
              onDrop={(e) => {
                e.preventDefault();
                if (!maxReached) addPendingImages(e.dataTransfer.files);
              }}
              className="rounded-xl border-2 border-dashed border-slate-300 bg-slate-50/60 flex flex-col items-center justify-center px-6 py-10 text-center transition-colors hover:border-[#4A9FF5] hover:bg-sky-50/40"
            >
              <UploadCloud size={34} className="text-slate-400 mb-2" />
              <p className="text-[13px] font-semibold text-slate-700">
                Drag &amp; drop images here
              </p>
              <p className="text-xs text-slate-500 mt-0.5 mb-3">
                JPG, PNG or WebP · up to 5MB each · {MAX_IMAGES} max
              </p>
              <label className="cursor-pointer inline-flex items-center justify-center h-9 px-4 rounded-lg bg-[#4A9FF5] text-white text-[13px] font-medium hover:bg-[#3d8be0] transition">
                Browse files
                <input
                  type="file"
                  accept="image/jpeg,image/png,image/webp"
                  multiple
                  className="hidden"
                  disabled={maxReached}
                  onChange={(e) => {
                    if (e.target.files && e.target.files.length) {
                      addPendingImages(e.target.files);
                      e.target.value = '';
                    }
                  }}
                />
              </label>
              {maxReached && (
                <p className="mt-2 text-xs text-amber-600">
                  Maximum of {MAX_IMAGES} images reached for this property.
                </p>
              )}
            </div>

            {existingImages.length > 0 && (
              <div>
                <p className="text-[13px] font-semibold text-[#101820] mb-2">
                  Current images ({existingImages.length})
                </p>
                <div className="grid grid-cols-3 md:grid-cols-5 gap-3">
                  {existingImages.map((image, index) => (
                    <div
                      key={image.publicId || image.imageUrl}
                      className="relative rounded-lg overflow-hidden bg-slate-100 border border-slate-200"
                    >
                      <img
                        src={image.imageUrl}
                        alt=""
                        className="w-full h-24 object-cover"
                      />
                      <span className="absolute bottom-1 left-1 bg-black/60 text-white text-[9px] px-1.5 py-0.5 rounded">
                        {image.isCover ? 'Cover' : `#${index + 1}`}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {pendingImages.length > 0 && (
              <div>
                <p className="text-[13px] font-semibold text-[#101820] mb-2">
                  New images ({pendingImages.length})
                </p>
                <div className="grid grid-cols-3 md:grid-cols-5 gap-3">
                  {pendingImages.map((image) => (
                    <div
                      key={image.preview}
                      className="relative rounded-lg overflow-hidden bg-slate-100 border border-slate-200"
                    >
                      <img src={image.preview} alt="" className="w-full h-24 object-cover" />
                      <button
                        type="button"
                        onClick={() => removePendingImage(image.preview)}
                        aria-label="Remove image"
                        className="absolute top-1 right-1 w-6 h-6 rounded-full bg-black/60 text-white flex items-center justify-center hover:bg-red-500 transition cursor-pointer"
                      >
                        <X size={13} />
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        );

      case 5:
        return (
          <div className="space-y-6">
            <div className="rounded-xl border border-slate-200 divide-y divide-slate-100 bg-white">
              {[
                { label: 'Title', value: form.title || '—' },
                {
                  label: 'Listing type',
                  value: form.listingType === 'sale' ? 'For Sale' : 'For Rent',
                },
                { label: 'Category', value: categories.find((c) => String(c.id) === String(form.categoryId))?.name || '—' },
                {
                  label: 'Price',
                  value: form.price ? `Br ${Number(form.price).toLocaleString()}` : '—',
                },
                {
                  label: 'Location',
                  value: [form.city, form.country].filter(Boolean).join(', ') || '—',
                },
              ].map((row) => (
                <div key={row.label} className="flex justify-between px-4 py-2.5 text-[13px]">
                  <span className="text-slate-500 font-medium">{row.label}</span>
                  <span className="font-semibold text-slate-800 text-right max-w-[55%] truncate">
                    {row.value}
                  </span>
                </div>
              ))}
            </div>

            {amenities.length > 0 && (
              <div>
                <p className="text-[13px] font-semibold text-[#101820] mb-2">Amenities</p>
                <div className="flex flex-wrap gap-2">
                  {amenities.map((amenity) => (
                    <span
                      key={amenity}
                      className="px-3 py-1 rounded-full bg-[#4A9FF5]/10 text-[#1f6fd0] text-[12px] font-medium border border-[#4A9FF5]/20"
                    >
                      {amenity}
                    </span>
                  ))}
                </div>
              </div>
            )}

            {totalImages > 0 && (
              <div>
                <p className="text-[13px] font-semibold text-[#101820] mb-2">
                  Images ({totalImages})
                </p>
                <div className="grid grid-cols-4 md:grid-cols-6 gap-3">
                  {existingImages.map((image) => (
                    <img
                      key={image.publicId || image.imageUrl}
                      src={image.imageUrl}
                      alt=""
                      className="h-16 w-full object-cover rounded-lg border border-slate-200"
                    />
                  ))}
                  {pendingImages.map((image) => (
                    <img
                      key={image.preview}
                      src={image.preview}
                      alt=""
                      className="h-16 w-full object-cover rounded-lg border border-slate-200"
                    />
                  ))}
                </div>
              </div>
            )}
          </div>
        );

      default:
        return null;
    }
  };

  const isLastStep = step === steps.length - 1;

  return (
    <div className="max-w-3xl mx-auto">
      {/* Stepper */}
      <ol className="flex items-center overflow-x-auto gap-1 pb-1">
        {steps.map((item, index) => {
          const complete = index < step;
          const active = index === step;
          return (
            <li key={item.key} className="flex items-center shrink-0">
              <button
                type="button"
                onClick={() => index < step && setStep(index)}
                className="flex items-center space-x-2 py-1.5 px-2.5 rounded-lg transition cursor-pointer"
              >
                <span
                  className={`w-7 h-7 rounded-full flex items-center justify-center border-2 text-[12px] font-bold transition ${
                    complete
                      ? 'border-[#4A9FF5] bg-[#4A9FF5] text-white'
                      : active
                        ? 'border-[#4A9FF5] text-[#1f6fd0] bg-[#4A9FF5]/10'
                        : 'border-slate-300 text-slate-400'
                  }`}
                >
                  {complete ? '✓' : index + 1}
                </span>
                <span
                  className={`hidden md:block text-[12px] font-semibold ${
                    active ? 'text-[#101820]' : 'text-slate-500'
                  }`}
                >
                  {item.label}
                </span>
              </button>
              {index < steps.length - 1 && <div className="w-6 md:w-10 h-px bg-slate-200" />}
            </li>
          );
        })}
      </ol>

      {/* Card */}
      <div className="mt-4 bg-white rounded-2xl border border-slate-200 p-6 shadow-sm">
        <h2 className="text-[17px] font-bold text-[#101820] mb-5 flex items-center space-x-2">
          {(() => {
            const Icon = steps[step].icon;
            return <Icon size={18} className="text-[#4A9FF5]" />;
          })()}
          <span>{steps[step].label}</span>
        </h2>

        {renderStepContent()}
      </div>

      {/* Actions */}
      <div className="mt-5 flex flex-col-reverse md:flex-row md:items-center md:justify-between gap-3">
        <div className="flex items-center">
          {step > 0 && (
            <button
              type="button"
              onClick={handleBack}
              disabled={submitting}
              className="flex items-center space-x-1.5 h-11 px-5 rounded-lg border border-slate-200 bg-white text-[13px] font-semibold text-slate-600 hover:bg-slate-50 transition w-full md:w-auto justify-center cursor-pointer disabled:opacity-50"
            >
              <ChevronLeft size={16} />
              <span>Back</span>
            </button>
          )}
          {isEdit && !isLastStep && (
            <span className="ml-3 text-[11px] text-slate-400">
              Saved fields are kept until you reach Review.
            </span>
          )}
        </div>

        <div className="flex flex-col sm:flex-row gap-3">
          {isLastStep ? (
            <>
              <button
                type="button"
                onClick={() => handleSave('draft')}
                disabled={submitting}
                className="flex items-center justify-center space-x-1.5 h-11 px-6 rounded-lg border border-slate-200 bg-white text-[13px] font-semibold text-slate-700 hover:bg-slate-50 transition cursor-pointer disabled:opacity-50"
              >
                {submitting ? <Loader2 size={16} className="animate-spin" /> : <Save size={15} />}
                <span>Save as Draft</span>
              </button>
              <button
                type="button"
                onClick={() => handleSave('available')}
                disabled={submitting}
                className="flex items-center justify-center space-x-1.5 h-11 px-6 rounded-lg bg-[#4A9FF5] text-white text-[13px] font-bold hover:bg-[#3d8be0] transition shadow-[0_4px_12px_rgba(74,159,245,0.35)] cursor-pointer disabled:opacity-50"
              >
                {submitting ? <Loader2 size={16} className="animate-spin" /> : <Rocket size={15} />}
                <span>Publish</span>
              </button>
            </>
          ) : (
            <button
              type="button"
              onClick={handleNext}
              className="flex items-center justify-center space-x-1.5 h-11 px-6 rounded-lg bg-[#4A9FF5] text-white text-[13px] font-bold hover:bg-[#3d8be0] transition shadow-[0_4px_12px_rgba(74,159,245,0.35)] cursor-pointer"
            >
              <span>Continue</span>
              <ChevronRight size={16} />
            </button>
          )}
        </div>
      </div>

      {submitError && (
        <p
          role="alert"
          className="mt-4 rounded-xl bg-rose-50 border border-rose-200 text-rose-700 text-xs px-4 py-3"
        >
          {submitError}
        </p>
      )}

      {onCancel && (
        <button
          type="button"
          onClick={onCancel}
          disabled={submitting}
          className="mt-4 h-9 px-4 text-[12px] font-medium text-slate-500 hover:text-slate-700 transition cursor-pointer disabled:opacity-50"
        >
          Cancel and go back
        </button>
      )}
    </div>
  );
};

export default PropertyForm;