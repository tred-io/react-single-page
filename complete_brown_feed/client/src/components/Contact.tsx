import { MapPin, Phone, Clock, Mail } from "lucide-react";

export default function Contact() {
  const hours = [
    { day: "Monday - Friday", time: "7:00 AM - 6:00 PM" },
    { day: "Saturday", time: "7:00 AM - 6:00 PM" },
    { day: "Sunday", time: "9:00 AM - 4:00 PM" }
  ];

  return (
    <section id="contact" className="py-16 bg-white">
      <div className="max-w-6xl mx-auto px-4">
        <div className="text-center mb-12">
          <h2 className="text-3xl lg:text-4xl font-bold text-gray-900 mb-4">Visit Our Store</h2>
          <p className="text-lg text-gray-600 max-w-3xl mx-auto">
            Come see us for all your feed and supply needs. We're here to help!
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
          <div>
            <div className="bg-gray-50 p-8 rounded-lg">
              <h3 className="text-2xl font-bold text-gray-900 mb-6">Contact Information</h3>
              
              <div className="space-y-4">
                <div className="flex items-start">
                  <MapPin className="h-6 w-6 text-green-700 mr-4 mt-1 flex-shrink-0" />
                  <div>
                    <h4 className="font-semibold text-gray-900">Address</h4>
                    <p className="text-gray-600">1234 Highway 281<br />Lampasas, TX 76550</p>
                    <a 
                      href="https://maps.google.com/?q=1234+Highway+281,+Lampasas,+TX+76550"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-green-700 hover:underline text-sm"
                    >
                      Get Directions
                    </a>
                  </div>
                </div>

                <div className="flex items-start">
                  <Phone className="h-6 w-6 text-green-700 mr-4 mt-1 flex-shrink-0" />
                  <div>
                    <h4 className="font-semibold text-gray-900">Phone</h4>
                    <a href="tel:5125551234" className="text-gray-600 hover:text-green-700">(512) 555-1234</a>
                  </div>
                </div>

                <div className="flex items-start">
                  <Mail className="h-6 w-6 text-green-700 mr-4 mt-1 flex-shrink-0" />
                  <div>
                    <h4 className="font-semibold text-gray-900">Email</h4>
                    <a href="mailto:info@brownfeedstore.com" className="text-gray-600 hover:text-green-700">info@brownfeedstore.com</a>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div>
            <div className="bg-green-50 p-8 rounded-lg">
              <h3 className="text-2xl font-bold text-gray-900 mb-6 flex items-center">
                <Clock className="h-6 w-6 text-green-700 mr-2" />
                Store Hours
              </h3>
              
              <div className="space-y-3">
                {hours.map((schedule, index) => (
                  <div key={index} className="flex justify-between items-center py-2 border-b border-green-200 last:border-b-0">
                    <span className="font-medium text-gray-900">{schedule.day}</span>
                    <span className="text-gray-600">{schedule.time}</span>
                  </div>
                ))}
              </div>
              
              <div className="mt-6 p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
                <p className="text-sm text-yellow-800">
                  <strong>Note:</strong> Hours may vary on federal holidays. Call ahead to confirm.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
