/**
 * Màn hình Bản đồ & Địa điểm quan trọng.
 * Mở Yandex Maps (chi tiết nhất ở Nga) để chỉ đường.
 * Developer: Xương Rồng AI Developer
 */
import React, { useState } from 'react';
import { MapPin, Navigation, Phone, Building2, Plane, Train, Hospital, Star } from 'lucide-react';
import { KEY_PLACES, PLACE_CATEGORIES, KeyPlace, yandexMapsUrl, googleMapsUrl } from '../data/places';
import { transliterateRussian } from '../../../services/transliterationService';

const CATEGORY_ICONS: Record<string, React.ReactNode> = {
  embassy: <Building2 className="w-5 h-5" />,
  airport: <Plane className="w-5 h-5" />,
  station: <Train className="w-5 h-5" />,
  hospital: <Hospital className="w-5 h-5" />,
  other: <Star className="w-5 h-5" />,
};

export const MapsView: React.FC = () => {
  const [filter, setFilter] = useState<string>('all');

  const filtered = filter === 'all'
    ? KEY_PLACES
    : KEY_PLACES.filter(p => p.category === filter);

  const openMaps = (place: KeyPlace, useGoogle = false) => {
    const query = `${place.nameRu}, ${place.addressRu}`;
    const url = useGoogle ? googleMapsUrl(query) : yandexMapsUrl(query);
    const updater = (window as any).AndroidUpdater;
    if (updater && typeof updater.openInBrowser === 'function') {
      updater.openInBrowser(url);
    } else {
      window.open(url, '_blank', 'noopener');
    }
  };

  return (
    <div className="space-y-4 pb-4">
      <div className="v2-fade-up">
        <h2 className="text-xl font-bold v2-text">Bản đồ & Chỉ đường</h2>
        <p className="text-sm v2-text-muted mt-1">
          Bấm "Chỉ đường" để mở bản đồ và dẫn đường đến nơi bạn cần.
        </p>
      </div>

      {/* Lọc theo loại */}
      <div className="flex gap-2 overflow-x-auto pb-1 v2-fade-up">
        <button
          onClick={() => setFilter('all')}
          className={`px-4 py-2 rounded-full text-sm font-medium whitespace-nowrap cursor-pointer transition ${
            filter === 'all' ? 'v2-accent-bg' : 'v2-card v2-text-muted'
          }`}
        >
          Tất cả
        </button>
        {Object.entries(PLACE_CATEGORIES).map(([key, label]) => (
          <button
            key={key}
            onClick={() => setFilter(key)}
            className={`px-4 py-2 rounded-full text-sm font-medium whitespace-nowrap cursor-pointer transition ${
              filter === key ? 'v2-accent-bg' : 'v2-card v2-text-muted'
            }`}
          >
            {label}
          </button>
        ))}
      </div>

      {/* Danh sách địa điểm */}
      <div className="space-y-3">
        {filtered.map((place) => (
          <div key={place.id} className="v2-card rounded-3xl p-4 v2-fade-up">
            <div className="flex items-start gap-3">
              <div className="w-11 h-11 rounded-2xl v2-accent-soft v2-accent-text flex items-center justify-center shrink-0">
                {CATEGORY_ICONS[place.category]}
              </div>
              <div className="flex-1 min-w-0">
                <h3 className="font-bold v2-text text-[15px]">{place.nameVi}</h3>
                <p className="text-sm v2-text-muted mt-0.5">{place.nameRu}</p>
                <p className="text-xs v2-text-faint italic mt-0.5">
                  📖 {transliterateRussian(place.nameRu)}
                </p>
                <p className="text-xs v2-text-muted mt-1 flex items-start gap-1">
                  <MapPin className="w-3.5 h-3.5 shrink-0 mt-0.5" />
                  {place.addressRu}
                </p>
              </div>
            </div>

            <div className="flex gap-2 mt-3">
              <button
                onClick={() => openMaps(place)}
                className="flex-1 flex items-center justify-center gap-2 py-3 rounded-2xl v2-accent-bg font-bold text-sm cursor-pointer"
              >
                <Navigation className="w-4 h-4" />
                Chỉ đường (Yandex)
              </button>
              {place.phone && (
                <a
                  href={`tel:${place.phone}`}
                  className="w-12 h-12 rounded-2xl v2-card flex items-center justify-center v2-text cursor-pointer"
                  title="Gọi điện"
                >
                  <Phone className="w-5 h-5" />
                </a>
              )}
            </div>
            <button
              onClick={() => openMaps(place, true)}
              className="w-full mt-2 text-xs v2-text-muted underline cursor-pointer"
            >
              Mở bằng Google Maps
            </button>
          </div>
        ))}
      </div>

      <p className="text-xs v2-text-faint text-center px-4">
        💡 Ở Nga, Yandex Maps chi tiết và chính xác hơn Google Maps.
      </p>
    </div>
  );
};
