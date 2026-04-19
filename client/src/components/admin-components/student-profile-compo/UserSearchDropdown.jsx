import { useState, useEffect, useRef } from 'react';
import { FaSearch, FaUser, FaChevronDown, FaTimes } from 'react-icons/fa';

const UserSearchDropdown = ({ users, selectedUser, onSelect, loading, error, disabled }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const dropdownRef = useRef(null);

  // Filter users based on search term and exclude users with student_id (already have profile)
  const filteredUsers = users.filter(user => {
    // Exclude users who already have a student profile (student_id is set)
    if (user.student_id) {
      return false;
    }
    
    const search = searchTerm.toLowerCase();
    return (
      user.name?.toLowerCase().includes(search) ||
      user.email?.toLowerCase().includes(search) ||
      user.id?.toString().includes(search)
    );
  });

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleSelect = (user) => {
    onSelect(user);
    setIsOpen(false);
    setSearchTerm('');
  };

  const handleClear = (e) => {
    e.stopPropagation();
    onSelect(null);
    setSearchTerm('');
  };

  return (
    <div className="relative" ref={dropdownRef}>
      <label className="block text-sm font-semibold text-gray-700 mb-2">
        Select Student User Account *
      </label>
      
      {/* Dropdown Trigger */}
      <button
        type="button"
        onClick={() => !disabled && setIsOpen(!isOpen)}
        disabled={disabled || loading}
        className={`w-full px-4 py-3 border-2 rounded-xl focus:outline-none transition-all flex items-center justify-between ${
          disabled || loading
            ? 'bg-gray-100 cursor-not-allowed border-gray-200'
            : 'bg-white border-gray-200 hover:border-orange-400 focus:border-orange-500'
        }`}
      >
        <div className="flex items-center gap-2 flex-1 text-left">
          <FaUser className="text-gray-400" />
          {selectedUser ? (
            <div className="flex flex-col">
              <span className="text-sm font-medium text-gray-900">{selectedUser.name}</span>
              <span className="text-xs text-gray-500">
                {selectedUser.email}
                {selectedUser.student_number && ` • ${selectedUser.student_number}`}
              </span>
            </div>
          ) : (
            <span className="text-gray-400">Select a student user...</span>
          )}
        </div>
        <div className="flex items-center gap-2">
          {selectedUser && !disabled && (
            <button
              type="button"
              onClick={handleClear}
              className="p-1 hover:bg-gray-100 rounded-full transition-colors"
            >
              <FaTimes className="text-gray-400 text-sm" />
            </button>
          )}
          <FaChevronDown className={`text-gray-400 transition-transform ${isOpen ? 'rotate-180' : ''}`} />
        </div>
      </button>

      {/* Dropdown Menu */}
      {isOpen && (
        <div className="absolute z-50 w-full mt-2 bg-white border-2 border-gray-200 rounded-xl shadow-xl max-h-80 overflow-hidden">
          {/* Search Input */}
          <div className="p-3 border-b border-gray-200 sticky top-0 bg-white">
            <div className="relative">
              <FaSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 text-sm" />
              <input
                type="text"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                placeholder="Search by name or email..."
                className="w-full pl-9 pr-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-orange-500 text-sm"
                autoFocus
              />
            </div>
          </div>

          {/* User List */}
          <div className="overflow-y-auto max-h-60">
            {loading ? (
              <div className="p-4 text-center text-gray-500 text-sm">
                Loading users...
              </div>
            ) : error ? (
              <div className="p-4 text-center text-red-500 text-sm">
                {error}
              </div>
            ) : filteredUsers.length === 0 ? (
              <div className="p-4 text-center text-gray-500 text-sm">
                {searchTerm ? 'No users found matching your search' : 'No student users available'}
              </div>
            ) : (
              filteredUsers.map((user) => (
                <button
                  key={user.id}
                  type="button"
                  onClick={() => handleSelect(user)}
                  className={`w-full px-4 py-3 text-left hover:bg-orange-50 transition-colors border-b border-gray-100 last:border-b-0 ${
                    selectedUser?.id === user.id ? 'bg-orange-50' : ''
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-orange-100 rounded-full flex items-center justify-center shrink-0">
                      <FaUser className="text-orange-600" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="font-medium text-gray-900 truncate">{user.name}</div>
                      <div className="text-sm text-gray-500 truncate">{user.email}</div>
                      {user.student_number && (
                        <div className="text-xs text-orange-600 font-medium mt-0.5">
                          {user.student_number} • {user.department === 'IT' ? 'IT' : 'CS'}
                        </div>
                      )}
                    </div>
                    {selectedUser?.id === user.id && (
                      <div className="w-2 h-2 bg-orange-600 rounded-full shrink-0"></div>
                    )}
                  </div>
                </button>
              ))
            )}
          </div>
        </div>
      )}

      <p className="mt-1 text-xs text-gray-500">
        Only showing student users without existing profiles. Users with profiles are automatically excluded.
      </p>
    </div>
  );
};

export default UserSearchDropdown;
