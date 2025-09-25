const awards = [
  {
    year: "2022",
    competition: "RoboCup Thailand",
    category: "@Home",
    result: "2nd Place",
    type: "second",
  },
  {
    year: "2024",
    competition: "RoboCup Malaysia",
    category: "@Home",
    result: "1st Place",
    type: "first",
  },
  {
    year: "2024",
    competition: "RoboCup Malaysia",
    category: "@HomeEDU",
    result: "1st Place",
    type: "first",
  },
  {
    year: "2025",
    competition: "RoboCup Malaysia",
    category: "@Home",
    result: "1st Place",
    type: "first",
  },
  {
    year: "2025",
    competition: "RCAP Chongqing Invitational",
    category: "5v5 Humanoid Soccer",
    result: "2nd Place",
    type: "second",
  },
]

const categories = [
  {
    icon: "🏠",
    title: "@Home League",
    description:
      "Service robots operating in domestic environments, performing household tasks and interacting with humans naturally.",
  },
  {
    icon: "🎓",
    title: "@Home Education",
    description:
      "Educational category focusing on fundamental robotics skills and knowledge development for emerging teams.",
  },
  {
    icon: "🏃‍♂️",
    title: "Humanoid Soccer",
    description:
      "Autonomous humanoid robots playing soccer, demonstrating advanced locomotion, perception, and coordination.",
  },
  {
    icon: "🏆",
    title: "RCAP Invitationals",
    description:
      "Regional championships in Asia-Pacific region featuring the best teams in various RoboCup categories.",
  },
]

export function RoboCupSection() {
  return (
    <section
      id="robocup"
      className="py-20 bg-gray-50"
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-4xl font-bold text-gray-900 mb-4">
            RoboCup Participations & Awards
          </h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Excellence in Competitive Robotics
          </p>
        </div>

        {/* Achievement Highlight */}
        <div className="bg-gradient-to-r from-yellow-400 to-orange-500 rounded-2xl p-8 md:p-12 text-center text-white mb-16">
          <div className="text-6xl mb-4">🏆</div>
          <h3 className="text-3xl font-bold mb-4">RoboCup Champions</h3>
          <p className="text-xl opacity-90 max-w-2xl mx-auto">
            Multiple first-place victories in RoboCup Malaysia competitions,
            establishing Robotedge as a leading force in Malaysian robotics
          </p>
        </div>

        {/* Awards Table */}
        <div className="mb-16">
          <h3 className="text-2xl font-semibold text-gray-900 mb-8 text-center">
            RoboCup Awards
          </h3>
          <div className="bg-white rounded-2xl shadow-lg overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-4 text-left text-sm font-semibold text-gray-900">
                      Year
                    </th>
                    <th className="px-6 py-4 text-left text-sm font-semibold text-gray-900">
                      Competition
                    </th>
                    <th className="px-6 py-4 text-left text-sm font-semibold text-gray-900">
                      Category
                    </th>
                    <th className="px-6 py-4 text-left text-sm font-semibold text-gray-900">
                      Result
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200">
                  {awards.map((award, index) => (
                    <tr
                      key={index}
                      className="hover:bg-gray-50 transition-colors"
                    >
                      <td className="px-6 py-4 text-sm text-gray-900 font-medium">
                        {award.year}
                      </td>
                      <td className="px-6 py-4 text-sm text-gray-900">
                        {award.competition}
                      </td>
                      <td className="px-6 py-4 text-sm text-gray-900">
                        {award.category}
                      </td>
                      <td className="px-6 py-4 text-sm">
                        <span
                          className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium ${
                            award.type === "first"
                              ? "bg-yellow-100 text-yellow-800"
                              : "bg-gray-100 text-gray-800"
                          }`}
                        >
                          {award.result}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>

        {/* Competition Categories */}
        <div>
          <h3 className="text-2xl font-semibold text-gray-900 mb-8 text-center">
            Competition Categories
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {categories.map((category, index) => (
              <div
                key={index}
                className="bg-white rounded-xl p-8 shadow-md hover:shadow-lg transition-shadow"
              >
                <div className="text-center">
                  <div className="text-4xl mb-4">{category.icon}</div>
                  <h4 className="text-xl font-semibold text-gray-900 mb-4">
                    {category.title}
                  </h4>
                  <p className="text-gray-600 leading-relaxed">
                    {category.description}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}
