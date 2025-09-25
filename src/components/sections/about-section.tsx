import Image from "next/image"

const teamMembers = [
  {
    name: "Dr. Zati Hakim Azizul Hasan",
    role: "Academic Supervisor",
    department: "Department of Artificial Intelligence",
    faculty: "Faculty of Computer Science and Information Technology (FCSIT)",
    university: "University Malaya",
    image: "/team/dr-zati.jpg", // placeholder
  },
]

const currentMembers = [
  {
    name: "Chia Jing Hui",
    role: "Master of Computer Science (Research)",
    type: "Postgraduate",
  },
  {
    name: "Maharaj Faawwaz A Yusran",
    role: "Master of Computer Science (Research)",
    type: "Postgraduate",
  },
  {
    name: "Muhammad Tareq Adam bin Ellias",
    role: "Bachelor of Computer Science (Artificial Intelligence)",
    type: "Undergraduate",
  },
  {
    name: "Hong Dao Jing",
    role: "Bachelor of Computer Science (Artificial Intelligence)",
    type: "Undergraduate",
  },
  {
    name: "Lee Chin Hong",
    role: "Bachelor of Mechanical Engineering",
    type: "Undergraduate",
  },
  {
    name: "Tan Jia Pern",
    role: "Bachelor of Mechanical Engineering",
    type: "Undergraduate",
  },
]

export function AboutSection() {
  return (
    <section
      id="about"
      className="py-20 bg-white"
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-4xl font-bold text-gray-900 mb-4">
            About Robotedge
          </h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            AI Robotics Lab of Universiti Malaya
          </p>
        </div>

        {/* Introduction */}
        <div className="mb-16">
          <div className="bg-gray-50 rounded-2xl p-8 md:p-12">
            <h3 className="text-2xl font-semibold text-gray-900 mb-6">
              Introduction
            </h3>
            <div className="space-y-4 text-gray-700 text-lg leading-relaxed">
              <p>
                Robotedge is the AI Robotics Lab of Universiti Malaya, bringing
                together students from Artificial Intelligence and Mechanical
                Engineering to explore the frontiers of service robotics. The
                lab was initiated by Dr Zati Hakim Azizul Hasan, whose
                leadership has been instrumental to its growth and development.
              </p>
              <p>
                Our mission is to advance service robotics through research in
                speech recognition, computer vision, robotic manipulation,
                navigation, and human-robot interaction. We design robots that
                support people in their daily lives while making positive
                contributions to society.
              </p>
              <p>
                Through research and development in speech recognition, computer
                vision, robotic manipulation, navigation, and human-robot
                interaction, we aim to design robots that support people in
                their daily lives while making a positive contribution to
                society. Beyond research, Robotedge is committed to education
                and outreach. We actively engage students and the wider
                community in AI and robotics, raising awareness through
                workshops, STEM exhibitions, and public demonstrations. By
                cultivating curiosity and skills at an early stage, we aspire to
                nurture the next generation of innovators who will drive
                Malaysia's future in robotics and artificial intelligence.
              </p>
            </div>
          </div>
        </div>

        {/* History */}
        <div className="mb-16">
          <h3 className="text-2xl font-semibold text-gray-900 mb-8 text-center">
            History
          </h3>
          <p className="text-gray-700 text-lg mb-8 text-center max-w-4xl mx-auto">
            Robotedge has grown from a small team of AI students into a dynamic,
            interdisciplinary robotics lab, building both technical expertise
            and a strong culture of innovation. Our journey can be traced
            through key milestones:
          </p>

          <div className="space-y-8">
            <div className="flex flex-col md:flex-row gap-6 items-start">
              <div className="bg-blue-600 text-white rounded-lg px-4 py-2 font-bold text-lg min-w-fit">
                2022
              </div>
              <div className="flex-1">
                <h4 className="text-xl font-semibold text-gray-900 mb-3">
                  The Beginning: A Small AI Student Team
                </h4>
                <p className="text-gray-700 mb-4">
                  Dr. Zati Hakim Azizul Hasan established Robotedge with a small
                  group of AI students. The focus was on software development
                  for robotics applications, building foundational skills in
                  computer vision, speech recognition, and basic navigation.
                  Despite being newcomers to the field, the team secured 2nd
                  place at RoboCup Thailand 2022 in the @Home category.
                </p>
              </div>
            </div>

            <div className="flex flex-col md:flex-row gap-6 items-start">
              <div className="bg-blue-600 text-white rounded-lg px-4 py-2 font-bold text-lg min-w-fit">
                2023
              </div>
              <div className="flex-1">
                <h4 className="text-xl font-semibold text-gray-900 mb-3">
                  Expanding Activities Beyond Competitions
                </h4>
                <p className="text-gray-700 mb-4">
                  Building on early successes, the team began exploring broader
                  applications, including organising robots, receptionist
                  robots, and robocars for computer vision demonstrations.
                  Robotedge also became active in STEM outreach, engaging
                  children and secondary school students through exhibitions and
                  hands-on showcases to inspire future talent.
                </p>
              </div>
            </div>

            <div className="flex flex-col md:flex-row gap-6 items-start">
              <div className="bg-blue-600 text-white rounded-lg px-4 py-2 font-bold text-lg min-w-fit">
                2024
              </div>
              <div className="flex-1">
                <h4 className="text-xl font-semibold text-gray-900 mb-3">
                  Growing into an Interdisciplinary Team
                </h4>
                <p className="text-gray-700 mb-4">
                  Robotedge expanded to include students from Mechanical
                  Engineering, creating a stronger foundation in both hardware
                  and software development. This collaboration enabled the
                  transition from software modules to integrated robotic
                  systems. With MoveIt and robotic arms, the team successfully
                  implemented pick-and-place modules and advanced manipulation
                  tasks.
                </p>
                <p className="text-gray-700 mb-4">
                  At RoboCup Malaysia 2024, this progress translated into
                  success: Universiti Malaya teams achieved first and second
                  place in the @Home category, and another team earned second
                  place in the @Home Edu category.
                </p>
              </div>
            </div>

            <div className="flex flex-col md:flex-row gap-6 items-start">
              <div className="bg-blue-600 text-white rounded-lg px-4 py-2 font-bold text-lg min-w-fit">
                2025
              </div>
              <div className="flex-1">
                <h4 className="text-xl font-semibold text-gray-900 mb-3">
                  Representing Malaysia on the World Stage
                </h4>
                <p className="text-gray-700 mb-4">
                  In Perlis at RoboCup Malaysia 2025, Robotedge achieved a
                  remarkable milestone by securing first place in the @Home
                  category, further solidifying our position as a leading
                  robotics team in Malaysia. Building on this momentum, the team
                  has also been invited to join the World Humanoid Robot Games
                  2025. This marks the beginning of our journey into humanoid
                  soccer competitions, expanding our focus beyond service
                  robotics.
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Team */}
        <div className="mb-16">
          <h3 className="text-2xl font-semibold text-gray-900 mb-8 text-center">
            Academic Supervisor
          </h3>

          <div className="max-w-2xl mx-auto">
            {teamMembers.map((member, index) => (
              <div
                key={index}
                className="bg-gray-50 rounded-2xl p-8 text-center"
              >
                <div className="w-32 h-32 mx-auto mb-6 bg-gray-200 rounded-full flex items-center justify-center">
                  <span className="text-4xl font-bold text-gray-400">
                    {member.name
                      .split(" ")
                      .map((n) => n[0])
                      .join("")}
                  </span>
                </div>
                <h4 className="text-xl font-semibold text-gray-900 mb-2">
                  {member.name}
                </h4>
                <p className="text-blue-600 font-medium mb-2">{member.role}</p>
                <p className="text-gray-600 text-sm">{member.department}</p>
                <p className="text-gray-600 text-sm">{member.faculty}</p>
                <p className="text-gray-600 text-sm">{member.university}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Current Team Members */}
        <div className="mb-16">
          <h3 className="text-2xl font-semibold text-gray-900 mb-8 text-center">
            Student Members
          </h3>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {currentMembers.map((member, index) => (
              <div
                key={index}
                className="bg-gray-50 rounded-xl p-6 text-center"
              >
                <div className="w-16 h-16 mx-auto mb-4 bg-blue-100 rounded-full flex items-center justify-center">
                  <span className="text-lg font-bold text-blue-600">
                    {member.name
                      .split(" ")
                      .map((n) => n[0])
                      .join("")}
                  </span>
                </div>
                <h4 className="text-lg font-semibold text-gray-900 mb-2">
                  {member.name}
                </h4>
                <p className="text-gray-600 text-sm mb-1">{member.role}</p>
                <span className="inline-block px-3 py-1 bg-blue-100 text-blue-800 text-xs font-medium rounded-full">
                  {member.type}
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* Contact Information */}
        <div className="bg-gradient-to-r from-blue-600 to-teal-600 rounded-2xl p-8 md:p-12 text-white">
          <h3 className="text-2xl font-semibold mb-6 text-center">
            Contact Us
          </h3>
          <p className="text-center mb-8 text-blue-100 max-w-3xl mx-auto">
            Robotedge welcomes any students, researchers, media, and industry
            partners. If you're interested in collaboration, sponsorship, or
            learning more about our work, please reach out to us using the
            contact details below:
          </p>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="text-center">
              <div className="w-12 h-12 mx-auto mb-4 bg-white/20 rounded-full flex items-center justify-center">
                <svg
                  className="w-6 h-6"
                  fill="currentColor"
                  viewBox="0 0 20 20"
                >
                  <path d="M2.003 5.884L10 9.882l7.997-3.998A2 2 0 0016 4H4a2 2 0 00-1.997 1.884z" />
                  <path d="M18 8.118l-8 4-8-4V14a2 2 0 002 2h12a2 2 0 002-2V8.118z" />
                </svg>
              </div>
              <h4 className="font-semibold mb-2">Email</h4>
              <p className="text-blue-100">umrobotedge@gmail.com</p>
              <p className="text-blue-100">zati@um.edu.my</p>
            </div>

            <div className="text-center">
              <div className="w-12 h-12 mx-auto mb-4 bg-white/20 rounded-full flex items-center justify-center">
                <svg
                  className="w-6 h-6"
                  fill="currentColor"
                  viewBox="0 0 20 20"
                >
                  <path
                    fillRule="evenodd"
                    d="M5.05 4.05a7 7 0 119.9 9.9L10 18.9l-4.95-4.95a7 7 0 010-9.9zM10 11a2 2 0 100-4 2 2 0 000 4z"
                    clipRule="evenodd"
                  />
                </svg>
              </div>
              <h4 className="font-semibold mb-2">Location</h4>
              <p className="text-blue-100 text-sm">
                Faculty of Computer Science and Information Technology
                <br />
                University of Malaya, 50603 Kuala Lumpur, Malaysia
              </p>
            </div>

            <div className="text-center">
              <div className="w-12 h-12 mx-auto mb-4 bg-white/20 rounded-full flex items-center justify-center">
                <svg
                  className="w-6 h-6"
                  fill="currentColor"
                  viewBox="0 0 20 20"
                >
                  <path d="M13 6a3 3 0 11-6 0 3 3 0 016 0zM18 8a2 2 0 11-4 0 2 2 0 014 0zM14 15a4 4 0 00-8 0v3h8v-3z" />
                </svg>
              </div>
              <h4 className="font-semibold mb-2">Social Media</h4>
              <p className="text-blue-100 text-sm">Instagram: Coming soon!</p>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
