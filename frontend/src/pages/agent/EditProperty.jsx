import { useEffect, useRef, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { Loader2, ArrowLeft } from 'lucide-react';
import { useToast } from '../../hooks/useToast';
import PropertyForm from '../../components/forms/PropertyForm';
import SaveNotice from '../../components/agent/SaveNotice';
import { getPropertyById } from '../../services/property.service';
import { ROUTES } from '../../utils/constants';

const mapPropertyToFormInitial = (property) => ({
  id: property.id,
  title: property.title,
  description: property.description,
  listingType: property.listingType || property.listing_type,
  categoryId: property.categoryId || property.category_id,
  price: property.price,
  area: property.area,
  bedrooms: property.bedrooms,
  bathrooms: property.bathrooms,
  parkingSpaces: property.parking ?? property.parking_spaces,
  country: property.country,
  city: property.city,
  address: property.address,
  latitude: property.latitude,
  longitude: property.longitude,
  status: property.status,
  amenities: property.amenities || [],
  images: property.images || [],
});

const EditProperty = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { toastMessage, toastTone, showToast } = useToast();
  const redirectRef = useRef(null);

  const [initial, setInitial] = useState(null);
  const [loadedId, setLoadedId] = useState(null);
  const [loadError, setLoadError] = useState('');
  const [saveFailed, setSaveFailed] = useState(false);

  useEffect(
    () => () => {
      if (redirectRef.current) {
        clearTimeout(redirectRef.current);
      }
    },
    [],
  );

  useEffect(() => {
    let cancelled = false;

    getPropertyById(id)
      .then((property) => {
        if (cancelled) return;
        setInitial(mapPropertyToFormInitial(property));
        setLoadedId(id);
        setLoadError('');
      })
      .catch(() => {
        if (cancelled) return;
        setLoadedId(id);
        setLoadError('Property not found or no longer accessible.');
      });

    return () => {
      cancelled = true;
    };
  }, [id]);

  const loading = loadedId !== id;

  const handleSaved = (status, notice) => {
    const base = status === 'draft' ? 'Draft updated successfully.' : 'Property updated and published!';
    if (notice) {
      setSaveFailed(true);
      showToast(`${base} ${notice}`, { tone: 'error', duration: 12000 });
      return;
    }
    showToast(base);
    redirectRef.current = setTimeout(() => navigate(ROUTES.agentProperties), 1100);
  };

  return (
    <div className="space-y-5 font-sans pb-10">
      <SaveNotice toastMessage={toastMessage} toastTone={toastTone} saveFailed={saveFailed} />

      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-[19px] font-bold text-[#101820] tracking-tight">Edit Property</h2>
          <p className="text-[12px] text-slate-500 mt-0.5">
            Update the listing details and press Publish when ready.
          </p>
        </div>
        <button
          type="button"
          onClick={() => navigate(ROUTES.agentProperties)}
          className="inline-flex items-center gap-1.5 h-9 px-3.5 rounded-lg border border-slate-200 bg-white text-[13px] font-semibold text-slate-600 hover:border-slate-300 transition cursor-pointer"
        >
          <ArrowLeft size={15} />
          Back
        </button>
      </div>

      {loading && (
        <div className="flex items-center justify-center py-16 text-slate-500 text-[13px] gap-2">
          <Loader2 size={18} className="animate-spin" />
          Loading listing...
        </div>
      )}

      {!loading && loadError && (
        <div className="rounded-xl bg-rose-50 border border-rose-200 text-rose-700 text-xs px-4 py-3">
          {loadError}
          <button
            type="button"
            onClick={() => navigate(ROUTES.agentProperties)}
            className="ml-3 underline font-semibold cursor-pointer"
          >
            Back to My Properties
          </button>
        </div>
      )}

      {!loading && !loadError && initial && (
        <PropertyForm
          initial={initial}
          onSaved={handleSaved}
          onCancel={() => navigate(ROUTES.agentProperties)}
        />
      )}
    </div>
  );
};

export default EditProperty;