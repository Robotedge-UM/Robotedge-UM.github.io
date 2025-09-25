const researchAreas = [
  {
    icon: "🤖",
    title: "Service Robotics",
    description:
      "Developing autonomous robots for domestic and professional service applications",
    topics: [
      "Object recognition and manipulation",
      "Navigation in complex environments",
      "Human-robot interaction",
      "Task planning and execution",
    ],
  },
  {
    icon: "👁️",
    title: "Computer Vision",
    description: "Advanced visual perception systems for robotic applications",
    topics: [
      "Real-time object detection",
      "Scene understanding",
      "Visual SLAM",
      "3D perception and mapping",
    ],
  },
  {
    icon: "🎤",
    title: "Speech Recognition",
    description: "Natural language processing and voice interaction systems",
    topics: [
      "Voice command processing",
      "Natural language understanding",
      "Multilingual speech recognition",
      "Conversational AI",
    ],
  },
  {
    icon: "🚶‍♂️",
    title: "Humanoid Robotics",
    description: "Bipedal locomotion and human-like robot behaviors",
    topics: [
      "Gait planning and control",
      "Balance and stability",
      "Soccer playing strategies",
      "Dynamic motion planning",
    ],
  },
]

export function ResearchSection() {
  return (
    <section
      id="research"
      className="py-20 bg-white"
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-4xl font-bold text-gray-900 mb-4">Research</h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Advancing Knowledge in AI and Robotics
          </p>
        </div>

        {/* Research Areas */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-16">
          {researchAreas.map((area, index) => (
            <div
              key={index}
              className="bg-gray-50 rounded-2xl p-8 hover:shadow-lg transition-shadow"
            >
              <div className="text-center mb-6">
                <div className="text-5xl mb-4">{area.icon}</div>
                <h3 className="text-2xl font-semibold text-gray-900 mb-3">
                  {area.title}
                </h3>
                <p className="text-gray-600 mb-6">{area.description}</p>
              </div>

              <ul className="space-y-2">
                {area.topics.map((topic, topicIndex) => (
                  <li
                    key={topicIndex}
                    className="flex items-center text-gray-700"
                  >
                    <span className="text-teal-600 mr-3">▸</span>
                    {topic}
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        {/* Research Philosophy */}
        <div className="bg-gradient-to-r from-blue-600 to-teal-600 rounded-2xl p-8 md:p-12 text-white text-center">
          <h3 className="text-2xl font-semibold mb-6">
            Our Research Philosophy
          </h3>
          <p className="text-lg text-blue-100 max-w-4xl mx-auto leading-relaxed">
            At Robotedge, we believe in <strong>EDGE</strong> principles that
            guide our research:
            <strong> Ethics</strong> in AI development,{" "}
            <strong>Diversity</strong> in our team and approaches,
            <strong>Green technology</strong> for sustainable solutions, and{" "}
            <strong>Engagement</strong> with society to ensure our innovations
            benefit everyone. Our research aims to create robots that not only
            perform tasks efficiently but also contribute positively to human
            well-being and environmental sustainability.
          </p>
        </div>

        {/* Placeholder for Future Content */}
        <div className="mt-16 text-center">
          <div className="bg-gray-50 rounded-2xl p-12">
            <div className="text-4xl mb-4">🔬</div>
            <h3 className="text-2xl font-semibold text-gray-900 mb-4">
              Research Portfolio
            </h3>
            <p className="text-gray-600 max-w-2xl mx-auto">
              Detailed information about our ongoing research projects,
              methodologies, and findings will be updated here soon. Stay tuned
              for exciting developments from our lab!
            </p>
          </div>
        </div>
      </div>
    </section>
  )
}
