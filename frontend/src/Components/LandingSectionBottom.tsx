
const stats = [
  { label: 'Uptime Guarantee', value: '99.99%' },
  { label: 'Detection Time', value: '< 30s' },
  { label: 'Happy Customers', value: '10k+' },
  { label: 'Support', value: '24/7' },
];

const features = [
  {
    title: 'Real-time Monitoring',
    icon: (
      <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l2 2m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
      </svg>
    ),
    description: 'Track your endpoints with live metrics and heartbeat checks.',
  },
  {
    title: 'Instant Alerts',
    icon: (
      <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6 6 0 10-12 0v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" />
      </svg>
    ),
    description: 'Get notified via email, SMS or Slack the moment something goes down.',
  },
  {
    title: 'Beautiful Dashboards',
    icon: (
      <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 3v18h18M16 16V8m-8 8v-4m4 4v-2" />
      </svg>
    ),
    description: 'Visualize uptime and performance trends with customizable graphs.',
  },
];

export default function FeaturesSection() {
  return (
    <section className="py-16 w-full">
      <div className="max-w-6xl mx-auto px-4">
        {/* Stats Row */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8 text-center mb-12">
          {stats.map((item) => (
            <div key={item.label}>
              <p className="text-3xl font-bold text-white">{item.value}</p>
              <p className="mt-2 text-gray-400">{item.label}</p>
            </div>
          ))}
        </div>

        {/* Section Heading */}
        <div className="text-center mb-12">
          <h2 className="text-4xl font-extrabold text-white mb-4">Everything you need to stay online</h2>
          <p className="text-lg text-gray-300">
            Powerful monitoring tools designed for modern teams who value simplicity and reliability.
          </p>
        </div>

        {/* Feature Cards */}
        <div className="grid gap-8 md:grid-cols-3">
          {features.map((feature) => (
            <div
              key={feature.title}
              className="bg-gray-800 rounded-2xl p-6 hover:bg-gray-700 transition-colors"
            >
              <div className="inline-flex items-center justify-center w-12 h-12 bg-teal-900 rounded-lg mb-4 text-teal-400">
                {feature.icon}
              </div>
              <h3 className="text-xl font-semibold text-white mb-2">{feature.title}</h3>
              <p className="text-gray-400">{feature.description}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}