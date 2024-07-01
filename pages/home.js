import { useState, useEffect } from 'react';
import Image from 'next/image';

const apiUrl = 'https://jsonplaceholder.typicode.com/users';

export default function Home() {
  const [comments, setComments] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [filteredData, setFilteredData] = useState([]);
  const [selectedProfile, setSelectedProfile] = useState(null);

  useEffect(() => {
    fetch(apiUrl)
      .then(response => response.json())
      .then(data => {
        const profiles = data.reduce((acc, user) => {
          acc[user.name] = {
            imageUrl: `https://via.placeholder.com/150?text=${user.name}`,
            bio: `${user.name}'s ${user.company.name}`,
          };
          return acc;
        }, {});
        setFilteredData(Object.keys(profiles));
        setComments(profiles); // Store profiles in comments state
      })
      .catch(error => console.error('Error fetching data:', error));
  }, []);

  const handleSearch = (event) => {
    const searchValue = event.target.value.toLowerCase();
    setSearchTerm(searchValue);
    const filtered = Object.keys(comments).filter(name =>
      name.toLowerCase().includes(searchValue)
    );
    setFilteredData(filtered);
  };

  const handleClick = (name) => {
    setSelectedProfile(comments[name]); // Set selected profile based on name
  };

  return (
    <main className="flex min-h-screen items-center justify-center p-6 bg-blue-200 dark:bg-blue-900">
      <div className="w-full max-w-md">
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-8 text-center">Home Page</h1>
        <input
          type="text"
          placeholder="Search..."
          value={searchTerm}
          onChange={handleSearch}
          className="w-full px-4 py-2 mb-4 border border-gray-300 dark:border-gray-700 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
        />
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {filteredData.map((name, index) => (
            <div key={index} className="bg-white dark:bg-gray-800 rounded-lg shadow-md">
              <div className="flex items-center p-4 cursor-pointer" onClick={() => handleClick(name)}>
                <Image
                  src={comments[name].imageUrl}
                  alt={name}
                  width={40}
                  height={40}
                  className="rounded-full mr-4"
                />
                <span>{name}</span>
              </div>
              {selectedProfile && selectedProfile.name === name && (
                <div className="p-4 border-t border-gray-200 dark:border-gray-700">
                  <p className="text-gray-700 dark:text-gray-300">{selectedProfile.bio}</p>
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    </main>
  );
}
