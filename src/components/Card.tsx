import Image from 'next/image'
import Link from 'next/link'
import { Star, MapPin, Clock, Utensils } from 'lucide-react'

export default function Card({ item, type }: { item: any, type: 'restaurant' | 'hotel' }) {
  const isRes = type === 'restaurant'
  const href = `/${type}s/${item.id}`
  
  return (
    <Link href={href} className="group glass-card block overflow-hidden">
      <div className="relative h-48 w-full overflow-hidden bg-gray-800">
        <div className="absolute inset-0 bg-gradient-to-t from-black/80 to-transparent z-10" />
        {item.imageUrl ? (
          <img 
            src={item.imageUrl} 
            alt={item.name} 
            className="object-cover w-full h-full group-hover:scale-110 transition-transform duration-500" 
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center text-gray-500">
            {isRes ? <Utensils className="w-10 h-10" /> : <Star className="w-10 h-10" />}
          </div>
        )}
        <div className="absolute bottom-3 left-3 z-20 flex gap-2">
          {isRes && (
            <span className="px-2 py-1 text-xs font-semibold bg-indigo-500 text-white rounded-md">
              {item.cuisine}
            </span>
          )}
          <span className="px-2 py-1 text-xs font-semibold bg-black/50 backdrop-blur-md text-white border border-white/20 rounded-md flex items-center gap-1">
            <Star className="w-3 h-3 fill-yellow-400 text-yellow-400" />
            {item.rating}
          </span>
        </div>
      </div>
      
      <div className="p-5">
        <div className="flex justify-between items-start mb-2">
          <h3 className="text-xl font-bold text-white group-hover:text-purple-400 transition-colors">
            {item.name}
          </h3>
          {isRes && (
            <span className="text-gray-400 font-medium">{item.priceRange}</span>
          )}
          {!isRes && (
            <div className="flex text-yellow-500">
              {[...Array(item.stars)].map((_, i) => (
                <Star key={i} className="w-3 h-3 fill-current" />
              ))}
            </div>
          )}
        </div>
        
        <p className="text-gray-400 text-sm mb-4 line-clamp-2">
          {item.description}
        </p>
        
        <div className="flex items-center gap-4 text-xs text-gray-500">
          <div className="flex items-center gap-1">
            <MapPin className="w-3.5 h-3.5" />
            {item.city}
          </div>
          {isRes && (
            <div className="flex items-center gap-1">
              <Clock className="w-3.5 h-3.5" />
              {item.openTime} - {item.closeTime}
            </div>
          )}
        </div>
      </div>
    </Link>
  )
}
