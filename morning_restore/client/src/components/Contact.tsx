import { useState } from "react";
import { useMutation } from "@tanstack/react-query";
import { MapPin, Phone, Mail, Clock, ExternalLink, Send } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useToast } from "@/hooks/use-toast";
import { apiRequest } from "@/lib/queryClient";

interface ContactForm {
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  subject: string;
  message: string;
}

export default function Contact() {
  const { toast } = useToast();
  const [formData, setFormData] = useState<ContactForm>({
    firstName: "",
    lastName: "",
    email: "",
    phone: "",
    subject: "",
    message: ""
  });

  const mutation = useMutation({
    mutationFn: async (data: ContactForm) => {
      const response = await apiRequest("POST", "/api/contact", data);
      return response.json();
    },
    onSuccess: (data) => {
      toast({
        title: "Message Sent!",
        description: data.message,
      });
      setFormData({
        firstName: "",
        lastName: "",
        email: "",
        phone: "",
        subject: "",
        message: ""
      });
    },
    onError: (error: any) => {
      toast({
        title: "Error",
        description: error.message || "Failed to send message. Please try again.",
        variant: "destructive",
      });
    },
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.firstName || !formData.lastName || !formData.email || !formData.message) {
      toast({
        title: "Missing Information",
        description: "Please fill in all required fields.",
        variant: "destructive",
      });
      return;
    }
    mutation.mutate(formData);
  };

  const handleInputChange = (field: keyof ContactForm, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  return (
    <section id="contact" className="py-16 bg-white">
      <div className="max-w-6xl mx-auto px-4">
        <div className="text-center mb-12">
          <h2 className="text-3xl lg:text-4xl font-serif font-bold text-saddle-brown mb-4">Contact Us</h2>
          <p className="text-lg text-gray-600">Visit us, call us, or send us a message - we're here to help</p>
        </div>
        
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
          {/* Contact Information */}
          <div>
            <div className="bg-gray-50 rounded-lg p-8 mb-8">
              <h3 className="text-2xl font-serif font-bold text-saddle-brown mb-6">Store Information</h3>
              
              <div className="space-y-4">
                <div className="flex items-start space-x-3">
                  <MapPin className="text-chocolate-orange h-6 w-6 mt-1" />
                  <div>
                    <h4 className="font-semibold text-slate-gray">Address</h4>
                    <p className="text-gray-600">1234 Highway 281<br />Lampasas, TX 76550</p>
                  </div>
                </div>
                
                <div className="flex items-start space-x-3">
                  <Phone className="text-chocolate-orange h-6 w-6 mt-1" />
                  <div>
                    <h4 className="font-semibold text-slate-gray">Phone</h4>
                    <p className="text-gray-600">
                      <a href="tel:+15125551234" className="hover:text-chocolate-orange transition-colors">(512) 555-1234</a>
                    </p>
                  </div>
                </div>
                
                <div className="flex items-start space-x-3">
                  <Mail className="text-chocolate-orange h-6 w-6 mt-1" />
                  <div>
                    <h4 className="font-semibold text-slate-gray">Email</h4>
                    <p className="text-gray-600">
                      <a href="mailto:info@brownfeedstore.com" className="hover:text-chocolate-orange transition-colors">info@brownfeedstore.com</a>
                    </p>
                  </div>
                </div>
                
                <div className="flex items-start space-x-3">
                  <Clock className="text-chocolate-orange h-6 w-6 mt-1" />
                  <div>
                    <h4 className="font-semibold text-slate-gray">Store Hours</h4>
                    <div className="text-gray-600 text-sm">
                      <p>Monday - Friday: 7:00 AM - 6:00 PM</p>
                      <p>Saturday: 7:00 AM - 6:00 PM</p>
                      <p>Sunday: 9:00 AM - 4:00 PM</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            
            {/* Map Placeholder */}
            <div className="bg-gray-200 rounded-lg h-64 flex items-center justify-center">
              <div className="text-center text-gray-500">
                <MapPin className="h-12 w-12 mb-2 mx-auto" />
                <p className="font-semibold">Interactive Map</p>
                <p className="text-sm">1234 Highway 281, Lampasas, TX 76550</p>
                <a 
                  href="https://maps.google.com/?q=1234+Highway+281+Lampasas+TX+76550" 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="inline-flex items-center mt-2 bg-chocolate-orange text-white px-4 py-2 rounded hover:bg-orange-600 transition-colors"
                >
                  Get Directions
                  <ExternalLink className="ml-2 h-4 w-4" />
                </a>
              </div>
            </div>
          </div>
          
          {/* Contact Form */}
          <div>
            <div className="bg-gray-50 rounded-lg p-8">
              <h3 className="text-2xl font-serif font-bold text-saddle-brown mb-6">Send Us a Message</h3>
              
              <form onSubmit={handleSubmit}>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                  <div>
                    <label htmlFor="firstName" className="block text-sm font-semibold text-slate-gray mb-2">First Name *</label>
                    <Input
                      id="firstName"
                      type="text"
                      value={formData.firstName}
                      onChange={(e) => handleInputChange("firstName", e.target.value)}
                      required
                      className="focus:ring-chocolate-orange focus:border-chocolate-orange"
                    />
                  </div>
                  <div>
                    <label htmlFor="lastName" className="block text-sm font-semibold text-slate-gray mb-2">Last Name *</label>
                    <Input
                      id="lastName"
                      type="text"
                      value={formData.lastName}
                      onChange={(e) => handleInputChange("lastName", e.target.value)}
                      required
                      className="focus:ring-chocolate-orange focus:border-chocolate-orange"
                    />
                  </div>
                </div>
                
                <div className="mb-4">
                  <label htmlFor="email" className="block text-sm font-semibold text-slate-gray mb-2">Email Address *</label>
                  <Input
                    id="email"
                    type="email"
                    value={formData.email}
                    onChange={(e) => handleInputChange("email", e.target.value)}
                    required
                    className="focus:ring-chocolate-orange focus:border-chocolate-orange"
                  />
                </div>
                
                <div className="mb-4">
                  <label htmlFor="phone" className="block text-sm font-semibold text-slate-gray mb-2">Phone Number</label>
                  <Input
                    id="phone"
                    type="tel"
                    value={formData.phone}
                    onChange={(e) => handleInputChange("phone", e.target.value)}
                    className="focus:ring-chocolate-orange focus:border-chocolate-orange"
                  />
                </div>
                
                <div className="mb-4">
                  <label htmlFor="subject" className="block text-sm font-semibold text-slate-gray mb-2">Subject</label>
                  <Select value={formData.subject} onValueChange={(value) => handleInputChange("subject", value)}>
                    <SelectTrigger className="focus:ring-chocolate-orange focus:border-chocolate-orange">
                      <SelectValue placeholder="Select a topic..." />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="product-inquiry">Product Inquiry</SelectItem>
                      <SelectItem value="feed-consultation">Feed Consultation</SelectItem>
                      <SelectItem value="delivery">Delivery Information</SelectItem>
                      <SelectItem value="hours">Store Hours</SelectItem>
                      <SelectItem value="other">Other</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                
                <div className="mb-6">
                  <label htmlFor="message" className="block text-sm font-semibold text-slate-gray mb-2">Message *</label>
                  <Textarea
                    id="message"
                    rows={4}
                    value={formData.message}
                    onChange={(e) => handleInputChange("message", e.target.value)}
                    required
                    className="resize-vertical focus:ring-chocolate-orange focus:border-chocolate-orange"
                  />
                </div>
                
                <Button 
                  type="submit" 
                  disabled={mutation.isPending}
                  className="w-full bg-chocolate-orange hover:bg-orange-600 text-white font-semibold py-3 px-6 transition-colors duration-300"
                >
                  {mutation.isPending ? (
                    "Sending..."
                  ) : (
                    <>
                      <Send className="mr-2 h-4 w-4" />
                      Send Message
                    </>
                  )}
                </Button>
              </form>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
