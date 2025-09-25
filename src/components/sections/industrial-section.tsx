"use client"

export function IndustrialSection() {
  return (
    <section
      id="industrial"
      className="py-20 bg-white"
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-4xl font-bold text-gray-900 mb-4">
            Industrial Applications
          </h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Bridging Research and Real-World Solutions
          </p>
        </div>

        {/* Application Areas */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-16">
          <div className="bg-gray-50 rounded-2xl p-8 text-center hover:shadow-lg transition-shadow">
            <div className="text-4xl mb-4">🏭</div>
            <h3 className="text-xl font-semibold text-gray-900 mb-4">
              Manufacturing Automation
            </h3>
            <p className="text-gray-600">
              Implementing robotic solutions for automated manufacturing
              processes, quality control, and supply chain optimization.
            </p>
          </div>

          <div className="bg-gray-50 rounded-2xl p-8 text-center hover:shadow-lg transition-shadow">
            <div className="text-4xl mb-4">🏥</div>
            <h3 className="text-xl font-semibold text-gray-900 mb-4">
              Healthcare Robotics
            </h3>
            <p className="text-gray-600">
              Developing assistive robots for patient care, rehabilitation, and
              hospital automation to improve healthcare delivery.
            </p>
          </div>

          <div className="bg-gray-50 rounded-2xl p-8 text-center hover:shadow-lg transition-shadow">
            <div className="text-4xl mb-4">🏪</div>
            <h3 className="text-xl font-semibold text-gray-900 mb-4">
              Service Industry
            </h3>
            <p className="text-gray-600">
              Creating robots for hospitality, retail, and customer service
              applications to enhance user experience and operational
              efficiency.
            </p>
          </div>

          <div className="bg-gray-50 rounded-2xl p-8 text-center hover:shadow-lg transition-shadow">
            <div className="text-4xl mb-4">🌾</div>
            <h3 className="text-xl font-semibold text-gray-900 mb-4">
              Agriculture Technology
            </h3>
            <p className="text-gray-600">
              Applying AI and robotics to precision agriculture, crop
              monitoring, and automated farming systems for sustainable food
              production.
            </p>
          </div>

          <div className="bg-gray-50 rounded-2xl p-8 text-center hover:shadow-lg transition-shadow">
            <div className="text-4xl mb-4">🚗</div>
            <h3 className="text-xl font-semibold text-gray-900 mb-4">
              Transportation
            </h3>
            <p className="text-gray-600">
              Developing autonomous navigation systems and intelligent
              transportation solutions for safer and more efficient mobility.
            </p>
          </div>

          <div className="bg-gray-50 rounded-2xl p-8 text-center hover:shadow-lg transition-shadow">
            <div className="text-4xl mb-4">🎓</div>
            <h3 className="text-xl font-semibold text-gray-900 mb-4">
              Education Technology
            </h3>
            <p className="text-gray-600">
              Creating educational robots and AI tutoring systems to enhance
              STEM learning and make technology education more accessible.
            </p>
          </div>
        </div>

        {/* Partnership Opportunities */}
        <div className="bg-gradient-to-r from-blue-600 to-teal-600 rounded-2xl p-8 md:p-12 text-white text-center mb-16">
          <h3 className="text-2xl font-semibold mb-6">
            Partnership Opportunities
          </h3>
          <p className="text-lg text-blue-100 max-w-4xl mx-auto mb-8">
            We welcome collaborations with industry partners to translate our
            research into practical solutions. Whether you're looking for custom
            robotics solutions, joint research projects, or technology transfer
            opportunities, we're ready to work with you to drive innovation.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <button
              onClick={() =>
                document
                  .getElementById("about")
                  ?.scrollIntoView({ behavior: "smooth" })
              }
              className="px-8 py-3 bg-white text-blue-600 font-semibold rounded-lg hover:bg-gray-100 transition-colors"
            >
              Contact Us
            </button>
            <button
              onClick={() =>
                document
                  .getElementById("research")
                  ?.scrollIntoView({ behavior: "smooth" })
              }
              className="px-8 py-3 bg-transparent text-white font-semibold border-2 border-white rounded-lg hover:bg-white hover:text-blue-600 transition-all"
            >
              View Research
            </button>
          </div>
        </div>

        {/* Placeholder Content */}
        <div className="text-center">
          <div className="bg-gray-50 rounded-2xl p-12">
            <div className="text-4xl mb-4">🏢</div>
            <h3 className="text-2xl font-semibold text-gray-900 mb-4">
              Industry Partnerships
            </h3>
            <p className="text-gray-600 max-w-2xl mx-auto">
              Information about our industrial collaborations and applications
              will be updated here. We are actively seeking partnerships with
              companies interested in implementing cutting-edge robotics
              solutions.
            </p>
          </div>
        </div>
      </div>
    </section>
  )
}
