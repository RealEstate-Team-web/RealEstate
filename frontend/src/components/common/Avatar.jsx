const Avatar = ({ src, alt, size = 36, className = '' }) => {
  const fallback =
    'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&q=80&w=200';
  return (
    <img
      src={src || fallback}
      alt={alt || 'User'}
      style={{ width: size, height: size }}
      className={`rounded-full object-cover shrink-0 bg-slate-200 ${className}`}
    />
  );
};

export default Avatar;
