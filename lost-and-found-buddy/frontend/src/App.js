import React, { useState, useEffect } from 'react';
import { Home, PlusCircle, Search, MessageCircle, Send, Camera } from 'lucide-react';

// Main App component which acts as the router and state manager.
const App = () => {
  const [page, setPage] = useState('home');
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [chatMessages, setChatMessages] = useState([
    { id: 1, user: 'Buddy', text: 'Hello! How can I help you find your lost item today?' },
    { id: 2, user: 'You', text: 'I lost my wallet near the library. Can you connect me with the owner if someone finds it?' },
    { id: 3, user: 'Buddy', text: 'Yes, if an item matching your description is posted, we will notify you and you can connect via our chat system.' },
  ]);

  // Fetch items from the backend on initial load and when the page changes
  useEffect(() => {
    fetchItems();
  }, [page]);

  const fetchItems = async () => {
    setLoading(true);
    try {
      const response = await fetch('http://localhost:3001/api/items');
      if (!response.ok) {
        throw new Error('Failed to fetch items.');
      }
      const data = await response.json();
      setItems(data);
    } catch (error) {
      console.error('Error fetching items:', error);
    } finally {
      setLoading(false);
    }
  };

  // Handle page navigation
  const navigate = (newPage) => {
    setPage(newPage);
  };

  // Render the current page based on state
  const renderPage = () => {
    if (loading) {
      return (
        <div className="flex justify-center items-center h-full">
          <p className="text-xl text-gray-500">Loading...</p>
        </div>
      );
    }
    switch (page) {
      case 'home':
        return <HomePage items={items} />;
      case 'post':
        return <PostItemPage fetchItems={fetchItems} />;
      case 'search':
        return <SearchPage items={items} />;
      case 'chat':
        return <ChatPage messages={chatMessages} setMessages={setChatMessages} />;
      default:
        return <HomePage items={items} />;
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 font-sans antialiased text-gray-800">
      {/* Header and Navigation */}
      <Header navigate={navigate} page={page} />
      
      {/* Main Content Area */}
      <div className="container mx-auto p-4 md:p-8">
        {renderPage()}
      </div>
      
      {/* Mobile Navigation */}
      <MobileNav navigate={navigate} page={page} />
    </div>
  );
};

// Reusable Header component for desktop view
const Header = ({ navigate, page }) => (
  <header className="hidden md:flex bg-white shadow-lg sticky top-0 z-50 rounded-b-xl">
    <div className="container mx-auto px-6 py-4 flex items-center justify-between">
      <h1 className="text-3xl font-bold text-gray-900">Lost & Found Buddy</h1>
      <nav className="flex items-center space-x-4">
        <NavLink icon={<Home />} label="Home" active={page === 'home'} onClick={() => navigate('home')} />
        <NavLink icon={<PlusCircle />} label="Post Item" active={page === 'post'} onClick={() => navigate('post')} />
        <NavLink icon={<Search />} label="Search" active={page === 'search'} onClick={() => navigate('search')} />
        <NavLink icon={<MessageCircle />} label="Chat" active={page === 'chat'} onClick={() => navigate('chat')} />
      </nav>
    </div>
  </header>
);

// Reusable Navigation Link component
const NavLink = ({ icon, label, active, onClick }) => (
  <button
    onClick={onClick}
    className={`flex items-center p-3 rounded-lg transition-all duration-200 ease-in-out
      ${active ? 'bg-indigo-500 text-white shadow-md' : 'text-gray-600 hover:bg-gray-200'}
      focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2`}
  >
    {icon}
    <span className="ml-2 font-medium">{label}</span>
  </button>
);

// Mobile-specific Navigation Bar
const MobileNav = ({ navigate, page }) => (
  <div className="fixed bottom-0 left-0 right-0 md:hidden bg-white shadow-lg p-2 rounded-t-xl z-50">
    <nav className="flex justify-around items-center">
      <MobileNavLink icon={<Home />} label="Home" active={page === 'home'} onClick={() => navigate('home')} />
      <MobileNavLink icon={<PlusCircle />} label="Post" active={page === 'post'} onClick={() => navigate('post')} />
      <MobileNavLink icon={<Search />} label="Search" active={page === 'search'} onClick={() => navigate('search')} />
      <MobileNavLink icon={<MessageCircle />} label="Chat" active={page === 'chat'} onClick={() => navigate('chat')} />
    </nav>
  </div>
);

// Mobile Navigation Link component
const MobileNavLink = ({ icon, label, active, onClick }) => (
  <button
    onClick={onClick}
    className={`flex flex-col items-center p-2 flex-grow transition-all duration-200 ease-in-out
      ${active ? 'text-indigo-600' : 'text-gray-500 hover:text-indigo-600'}
      focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 rounded-lg`}
  >
    {icon}
    <span className="text-xs mt-1">{label}</span>
  </button>
);

// Home Page Component
const HomePage = ({ items }) => (
  <section className="space-y-8">
    <div className="bg-white p-6 rounded-2xl shadow-xl border border-gray-200">
      <h2 className="text-3xl font-extrabold text-center text-gray-900 mb-4">Welcome to Lost & Found Buddy!</h2>
      <p className="text-lg text-center text-gray-600">
        A simple and secure way to report and find lost or found items in your community.
      </p>
    </div>
    
    <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
      {items.map(item => (
        <ItemCard key={item.id} item={item} />
      ))}
    </div>
  </section>
);

// Item Card Component
const ItemCard = ({ item }) => (
  <div className="bg-white p-6 rounded-2xl shadow-lg transform transition-transform duration-300 hover:scale-105 border border-gray-200">
    {/* Conditionally render the image if it exists */}
    {item.image && (
      <div className="mb-4 rounded-lg overflow-hidden">
        <img src={`http://localhost:3001${item.image}`} alt={item.title} className="w-full h-48 object-cover" />
      </div>
    )}
    <span className={`px-3 py-1 text-sm font-semibold rounded-full
      ${item.type === 'lost' ? 'bg-red-100 text-red-800' : 'bg-green-100 text-green-800'}`}>
      {item.type.charAt(0).toUpperCase() + item.type.slice(1)} Item
    </span>
    <h3 className="mt-4 text-xl font-bold text-gray-900">{item.title}</h3>
    <p className="mt-2 text-gray-600 line-clamp-3">{item.description}</p>
    <div className="mt-4 text-sm text-gray-500 space-y-1">
      <p><strong>Location:</strong> {item.location}</p>
      <p><strong>Date:</strong> {item.date}</p>
    </div>
  </div>
);

// Post Item Page Component
const PostItemPage = ({ fetchItems }) => {
  const [formData, setFormData] = useState({
    type: 'lost',
    title: '',
    description: '',
    location: '',
    contact: '',
    imageFile: null,
  });
  const [imagePreview, setImagePreview] = useState(null);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };
  
  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setFormData(prev => ({ ...prev, imageFile: file }));
      setImagePreview(URL.createObjectURL(file));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (formData.title && formData.description && formData.location) {
      const data = new FormData();
      data.append('type', formData.type);
      data.append('title', formData.title);
      data.append('description', formData.description);
      data.append('location', formData.location);
      data.append('contact', formData.contact);
      if (formData.imageFile) {
        data.append('itemImage', formData.imageFile);
      }

      try {
        const response = await fetch('http://localhost:3001/api/items', {
          method: 'POST',
          body: data, // Use FormData as the body
        });

        if (response.ok) {
          alert('Item posted successfully!');
          // Reset form and fetch updated items
          setFormData({
            type: 'lost',
            title: '',
            description: '',
            location: '',
            contact: '',
            imageFile: null,
          });
          setImagePreview(null);
          fetchItems();
        } else {
          alert('Failed to post item.');
        }
      } catch (error) {
        console.error('Error posting item:', error);
        alert('An error occurred while posting the item.');
      }
    } else {
      alert('Please fill out all required fields.');
    }
  };

  return (
    <section className="bg-white p-6 rounded-2xl shadow-xl border border-gray-200">
      <h2 className="text-3xl font-extrabold text-center text-gray-900 mb-6">Post a Lost or Found Item</h2>
      <form onSubmit={handleSubmit} className="space-y-6">
        <div>
          <label htmlFor="type" className="block text-sm font-medium text-gray-700">Item Status</label>
          <select
            id="type"
            name="type"
            value={formData.type}
            onChange={handleChange}
            className="mt-1 block w-full px-4 py-2 bg-gray-50 border border-gray-300 rounded-lg shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
          >
            <option value="lost">Lost</option>
            <option value="found">Found</option>
          </select>
        </div>
        <div>
          <label htmlFor="title" className="block text-sm font-medium text-gray-700">Title</label>
          <input
            type="text"
            id="title"
            name="title"
            value={formData.title}
            onChange={handleChange}
            placeholder="e.g., Black Leather Wallet"
            className="mt-1 block w-full px-4 py-2 bg-gray-50 border border-gray-300 rounded-lg shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
            required
          />
        </div>
        <div>
          <label htmlFor="description" className="block text-sm font-medium text-gray-700">Description</label>
          <textarea
            id="description"
            name="description"
            value={formData.description}
            onChange={handleChange}
            rows="4"
            placeholder="Describe the item, including any unique features."
            className="mt-1 block w-full px-4 py-2 bg-gray-50 border border-gray-300 rounded-lg shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
            required
          ></textarea>
        </div>
        <div>
          <label htmlFor="location" className="block text-sm font-medium text-gray-700">Location (Last Seen/Found)</label>
          <input
            type="text"
            id="location"
            name="location"
            value={formData.location}
            onChange={handleChange}
            placeholder="e.g., Campus Library, City Park"
            className="mt-1 block w-full px-4 py-2 bg-gray-50 border border-gray-300 rounded-lg shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
            required
          />
        </div>
        <div>
          <label htmlFor="contact" className="block text-sm font-medium text-gray-700">Contact Email</label>
          <input
            type="email"
            id="contact"
            name="contact"
            value={formData.contact}
            onChange={handleChange}
            placeholder="john.doe@email.com"
            className="mt-1 block w-full px-4 py-2 bg-gray-50 border border-gray-300 rounded-lg shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
          />
        </div>
        
        {/* Section for image capture */}
        <div>
          <label htmlFor="image" className="block text-sm font-medium text-gray-700">Item Photo (Optional)</label>
          <div className="mt-1 flex items-center justify-center p-4 border-2 border-dashed border-gray-300 rounded-lg">
            <input
              type="file"
              id="image"
              name="image"
              accept="image/*"
              capture="environment"
              onChange={handleImageChange}
              className="hidden"
            />
            {imagePreview ? (
              <img src={imagePreview} alt="Item Preview" className="max-h-64 rounded-lg object-contain" />
            ) : (
              <label htmlFor="image" className="cursor-pointer flex flex-col items-center text-gray-500 hover:text-indigo-600 transition-colors">
                <Camera size={48} className="mb-2" />
                <span className="text-sm font-medium text-center">Tap to capture or upload photo</span>
              </label>
            )}
          </div>
        </div>
        
        <button
          type="submit"
          className="w-full py-3 px-4 flex items-center justify-center bg-indigo-600 text-white font-bold rounded-lg shadow-lg hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 transition-colors duration-200"
        >
          <PlusCircle className="mr-2" size={20} /> Post Item
        </button>
      </form>
    </section>
  );
};

// Search Page Component
const SearchPage = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [itemType, setItemType] = useState('');
  const [searchResults, setSearchResults] = useState([]);
  const [loading, setLoading] = useState(false);
  const [hasSearched, setHasSearched] = useState(false);

  const handleSearch = async (e) => {
    e.preventDefault();
    setLoading(true);
    setHasSearched(true);
    try {
      const queryParams = new URLSearchParams();
      if (searchTerm) {
        queryParams.append('q', searchTerm);
      }
      if (itemType) {
        queryParams.append('type', itemType);
      }
      
      const response = await fetch(`http://localhost:3001/api/items?${queryParams.toString()}`);
      if (!response.ok) {
        throw new Error('Search failed.');
      }
      const data = await response.json();
      setSearchResults(data);
    } catch (error) {
      console.error('Error during search:', error);
      setSearchResults([]); // Clear results on error
    } finally {
      setLoading(false);
    }
  };

  const renderResults = () => {
    if (loading) {
      return <p className="col-span-full text-center text-gray-500 text-lg py-12">Searching...</p>;
    }
    if (hasSearched && searchResults.length === 0) {
      return <p className="col-span-full text-center text-gray-500 text-lg py-12">No items match your search criteria.</p>;
    }
    return searchResults.map(item => <ItemCard key={item.id} item={item} />);
  };

  return (
    <section>
      <div className="bg-white p-6 rounded-2xl shadow-xl border border-gray-200 mb-6">
        <h2 className="text-3xl font-extrabold text-center text-gray-900 mb-4">Search Items</h2>
        <form onSubmit={handleSearch} className="flex flex-col md:flex-row gap-4">
          <div className="relative flex-grow">
            <input
              type="text"
              placeholder="Search by title, description, or location..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full px-4 py-3 pl-12 bg-gray-50 border border-gray-300 rounded-lg shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
            />
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={20} />
          </div>
          <select
            value={itemType}
            onChange={(e) => setItemType(e.target.value)}
            className="flex-shrink-0 w-full md:w-auto px-4 py-3 bg-gray-50 border border-gray-300 rounded-lg shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
          >
            <option value="">All Items</option>
            <option value="lost">Lost Items</option>
            <option value="found">Found Items</option>
          </select>
          <button
            type="submit"
            className="flex-shrink-0 w-full md:w-auto py-3 px-6 bg-indigo-600 text-white font-bold rounded-lg shadow-lg hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 transition-colors duration-200"
          >
            Search
          </button>
        </form>
      </div>
      
      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
        {renderResults()}
      </div>
    </section>
  );
};

// Chat Page Component (Mock)
const ChatPage = ({ messages, setMessages }) => {
  const [input, setInput] = useState('');
  const chatContainerRef = React.useRef(null);

  React.useEffect(() => {
    // Scroll to the bottom of the chat on new message
    if (chatContainerRef.current) {
      chatContainerRef.current.scrollTop = chatContainerRef.current.scrollHeight;
    }
  }, [messages]);

  const handleSendMessage = (e) => {
    e.preventDefault();
    if (input.trim()) {
      const newMessage = { id: messages.length + 1, user: 'You', text: input };
      setMessages(prevMessages => [...prevMessages, newMessage]);
      setInput('');
    }
  };

  return (
    <section className="bg-white p-6 rounded-2xl shadow-xl border border-gray-200 flex flex-col h-[70vh] md:h-[60vh]">
      <h2 className="text-3xl font-extrabold text-center text-gray-900 mb-4">Secure Chat</h2>
      <div
        ref={chatContainerRef}
        className="flex-grow overflow-y-auto space-y-4 p-4 bg-gray-50 rounded-lg border border-gray-200"
      >
        {messages.map((msg) => (
          <div key={msg.id} className={`flex ${msg.user === 'You' ? 'justify-end' : 'justify-start'}`}>
            <div className={`max-w-xs md:max-w-md p-3 rounded-lg shadow-md
              ${msg.user === 'You' ? 'bg-indigo-500 text-white' : 'bg-white text-gray-800 border border-gray-200'}`}
            >
              <span className="text-xs font-semibold block mb-1">{msg.user}</span>
              {msg.text}
            </div>
          </div>
        ))}
      </div>
      <form onSubmit={handleSendMessage} className="mt-4 flex space-x-2">
        <input
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="Type your message..."
          className="flex-grow px-4 py-2 bg-gray-100 border border-gray-300 rounded-lg focus:ring-indigo-500 focus:border-indigo-500"
        />
        <button
          type="submit"
          className="p-3 bg-indigo-600 text-white rounded-lg shadow-lg hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 transition-colors duration-200"
        >
          <Send size={20} />
        </button>
      </form>
    </section>
  );
};

export default App;