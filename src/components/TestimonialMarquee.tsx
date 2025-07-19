const testimonials = [
  { name: "Alex Johnson", role: "Agency Owner", company: "BluePeak Digital", text: "ClientFlow helped us cut admin time in half. Our clients love the new portal!", stars: 5, color: "from-blue-500 to-purple-500" },
  { name: "Maria Perez", role: "Freelancer", company: "", text: "The automation features are a lifesaver. I can focus on my work, not paperwork.", stars: 5, color: "from-pink-500 to-yellow-400" },
  { name: "Samir Khan", role: "Project Manager", company: "BrightWorks", text: "We finally have a single source of truth for all our projects. Support is fantastic.", stars: 4, color: "from-green-400 to-blue-400" },
  { name: "Linda Smith", role: "Consultant", company: "", text: "The analytics dashboard gives me insights I never had before. Highly recommended!", stars: 5, color: "from-purple-500 to-pink-500" },
  { name: "Chris Thompson", role: "Operations Lead", company: "AgencyX", text: "Easy to use, beautiful UI, and our team is more productive than ever.", stars: 5, color: "from-yellow-400 to-orange-500" },
  { name: "Priya Reddy", role: "Founder", company: "Reddy Solutions", text: "Onboarding was seamless. We scaled our business with ClientFlow!", stars: 5, color: "from-blue-400 to-cyan-400" },
  { name: "Jordan Miller", role: "Account Manager", company: "", text: "Continuous updates and new features keep getting better. Love the attention to detail.", stars: 4, color: "from-pink-400 to-purple-400" },
];

export default function TestimonialMarquee() {
  return (
    <div className="py-20 px-2 sm:px-6 lg:px-8 bg-gradient-to-b from-purple-50 via-white to-blue-50 rounded-3xl">
      <div className="flex flex-wrap justify-center gap-10">
        {testimonials.map((t, i) => (
          <div
            key={i}
            className={`relative group bg-white rounded-3xl shadow-xl border border-gray-100 p-8 max-w-xs w-full text-center flex flex-col items-center transition-transform duration-200 hover:scale-105 hover:shadow-2xl ${i % 2 === 1 ? 'mt-8' : ''}`}
          >
            {/* Quote icon */}
            <div className="absolute -top-6 left-1/2 -translate-x-1/2 text-4xl text-purple-200 select-none">“</div>
            {/* Avatar */}
            <div className={`w-16 h-16 mb-4 rounded-full flex items-center justify-center bg-gradient-to-br ${t.color} text-white text-2xl font-bold shadow-md border-4 border-white`}>
              {t.name.split(' ').map(n => n[0]).join('')}
            </div>
            {/* Stars */}
            <div className="flex mb-2 justify-center">
              {Array.from({ length: t.stars }).map((_, idx) => (
                <span key={idx} className="text-yellow-400 text-lg">★</span>
              ))}
              {Array.from({ length: 5 - t.stars }).map((_, idx) => (
                <span key={idx} className="text-gray-300 text-lg">★</span>
              ))}
            </div>
            {/* Testimonial text */}
            <div className="text-base font-medium text-gray-800 mb-3 italic">{t.text}</div>
            {/* Name and role/company */}
            <div className="font-semibold text-gray-900 text-base tracking-wide">{t.name}</div>
            {(t.role || t.company) && (
              <div className="text-sm text-gray-500 mt-1">
                {t.role}{t.role && t.company ? ' at ' : ''}{t.company}
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
} 