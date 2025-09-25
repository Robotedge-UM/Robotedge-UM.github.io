export function PublicationsSection() {
  return (
    <section
      id="publications"
      className="py-20 bg-gray-50"
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-4xl font-bold text-gray-900 mb-4">
            Publications
          </h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Our Contributions to Scientific Literature
          </p>
        </div>

        {/* Publication Categories */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-16">
          <div className="bg-white rounded-2xl p-8 shadow-md">
            <div className="text-center">
              <div className="w-16 h-16 mx-auto mb-4 bg-blue-100 rounded-full flex items-center justify-center">
                <svg
                  className="w-8 h-8 text-blue-600"
                  fill="currentColor"
                  viewBox="0 0 20 20"
                >
                  <path d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-4">
                Conference Papers
              </h3>
              <p className="text-gray-600">
                Peer-reviewed research presented at international robotics and
                AI conferences
              </p>
            </div>
          </div>

          <div className="bg-white rounded-2xl p-8 shadow-md">
            <div className="text-center">
              <div className="w-16 h-16 mx-auto mb-4 bg-teal-100 rounded-full flex items-center justify-center">
                <svg
                  className="w-8 h-8 text-teal-600"
                  fill="currentColor"
                  viewBox="0 0 20 20"
                >
                  <path
                    fillRule="evenodd"
                    d="M4 4a2 2 0 012-2h8a2 2 0 012 2v12a2 2 0 01-2 2H6a2 2 0 01-2-2V4zm2 0v12h8V4H6z"
                    clipRule="evenodd"
                  />
                </svg>
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-4">
                Journal Articles
              </h3>
              <p className="text-gray-600">
                In-depth research articles published in academic journals
              </p>
            </div>
          </div>

          <div className="bg-white rounded-2xl p-8 shadow-md">
            <div className="text-center">
              <div className="w-16 h-16 mx-auto mb-4 bg-yellow-100 rounded-full flex items-center justify-center">
                <svg
                  className="w-8 h-8 text-yellow-600"
                  fill="currentColor"
                  viewBox="0 0 20 20"
                >
                  <path d="M3 4a1 1 0 011-1h12a1 1 0 011 1v2a1 1 0 01-1 1H4a1 1 0 01-1-1V4zM3 10a1 1 0 011-1h6a1 1 0 011 1v6a1 1 0 01-1 1H4a1 1 0 01-1-1v-6zM14 9a1 1 0 00-1 1v6a1 1 0 001 1h2a1 1 0 001-1v-6a1 1 0 00-1-1h-2z" />
                </svg>
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-4">
                Technical Reports
              </h3>
              <p className="text-gray-600">
                Detailed technical documentation of our research findings and
                methodologies
              </p>
            </div>
          </div>
        </div>

        {/* Publication Stats */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-16">
          <div className="bg-white rounded-xl p-6 text-center shadow-md">
            <div className="text-3xl font-bold text-blue-600 mb-2">0</div>
            <div className="text-sm text-gray-600">Published Papers</div>
          </div>
          <div className="bg-white rounded-xl p-6 text-center shadow-md">
            <div className="text-3xl font-bold text-teal-600 mb-2">0</div>
            <div className="text-sm text-gray-600">Citations</div>
          </div>
          <div className="bg-white rounded-xl p-6 text-center shadow-md">
            <div className="text-3xl font-bold text-yellow-600 mb-2">3</div>
            <div className="text-sm text-gray-600">Research Areas</div>
          </div>
          <div className="bg-white rounded-xl p-6 text-center shadow-md">
            <div className="text-3xl font-bold text-purple-600 mb-2">5+</div>
            <div className="text-sm text-gray-600">Ongoing Projects</div>
          </div>
        </div>

        {/* Placeholder Content */}
        <div className="text-center">
          <div className="bg-white rounded-2xl p-12 shadow-md">
            <div className="text-4xl mb-4">📚</div>
            <h3 className="text-2xl font-semibold text-gray-900 mb-4">
              Academic Publications
            </h3>
            <p className="text-gray-600 max-w-2xl mx-auto">
              Our publications and research papers will be featured here soon.
              We are currently preparing several manuscripts for submission to
              top-tier conferences and journals in robotics and artificial
              intelligence.
            </p>
          </div>
        </div>
      </div>
    </section>
  )
}
