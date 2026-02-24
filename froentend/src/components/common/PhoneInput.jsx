import React, { useState, useRef, useEffect } from 'react';
import { ChevronDown, Search } from 'lucide-react';
import { Input } from '../ui/input';

// Common countries with their flags and codes
const countries = [
    { name: "United States", code: "+1", iso: "us", dialCode: "1" },
    { name: "Canada", code: "+1", iso: "ca", dialCode: "1" },
    { name: "United Kingdom", code: "+44", iso: "gb", dialCode: "44" },
    { name: "India", code: "+91", iso: "in", dialCode: "91" },
    { name: "Australia", code: "+61", iso: "au", dialCode: "61" },
    { name: "Germany", code: "+49", iso: "de", dialCode: "49" },
    { name: "France", code: "+33", iso: "fr", dialCode: "33" },
    { name: "China", code: "+86", iso: "cn", dialCode: "86" },
    { name: "Japan", code: "+81", iso: "jp", dialCode: "81" },
    { name: "South Korea", code: "+82", iso: "kr", dialCode: "82" },
    { name: "Brazil", code: "+55", iso: "br", dialCode: "55" },
    { name: "Mexico", code: "+52", iso: "mx", dialCode: "52" },
    { name: "Russia", code: "+7", iso: "ru", dialCode: "7" },
    { name: "South Africa", code: "+27", iso: "za", dialCode: "27" },
    { name: "Nigeria", code: "+234", iso: "ng", dialCode: "234" },
    { name: "Egypt", code: "+20", iso: "eg", dialCode: "20" },
    { name: "Saudi Arabia", code: "+966", iso: "sa", dialCode: "966" },
    { name: "UAE", code: "+971", iso: "ae", dialCode: "971" },
    { name: "Singapore", code: "+65", iso: "sg", dialCode: "65" },
    { name: "Malaysia", code: "+60", iso: "my", dialCode: "60" },
    { name: "Indonesia", code: "+62", iso: "id", dialCode: "62" },
    { name: "Philippines", code: "+63", iso: "ph", dialCode: "63" },
    { name: "Thailand", code: "+66", iso: "th", dialCode: "66" },
    { name: "Vietnam", code: "+84", iso: "vn", dialCode: "84" },
    { name: "Pakistan", code: "+92", iso: "pk", dialCode: "92" },
    { name: "Bangladesh", code: "+880", iso: "bd", dialCode: "880" },
    { name: "Sri Lanka", code: "+94", iso: "lk", dialCode: "94" },
    { name: "Nepal", code: "+977", iso: "np", dialCode: "977" },
    { name: "Afghanistan", code: "+93", iso: "af", dialCode: "93" },
    { name: "Turkey", code: "+90", iso: "tr", dialCode: "90" },
    { name: "Italy", code: "+39", iso: "it", dialCode: "39" },
    { name: "Spain", code: "+34", iso: "es", dialCode: "34" },
    { name: "Netherlands", code: "+31", iso: "nl", dialCode: "31" },
    { name: "Belgium", code: "+32", iso: "be", dialCode: "32" },
    { name: "Switzerland", code: "+41", iso: "ch", dialCode: "41" },
    { name: "Sweden", code: "+46", iso: "se", dialCode: "46" },
    { name: "Norway", code: "+47", iso: "no", dialCode: "47" },
    { name: "Denmark", code: "+45", iso: "dk", dialCode: "45" },
    { name: "Poland", code: "+48", iso: "pl", dialCode: "48" },
    { name: "Greece", code: "+30", iso: "gr", dialCode: "30" },
    { name: "Portugal", code: "+351", iso: "pt", dialCode: "351" },
    { name: "Ireland", code: "+353", iso: "ie", dialCode: "353" },
    { name: "New Zealand", code: "+64", iso: "nz", dialCode: "64" },
    { name: "Argentina", code: "+54", iso: "ar", dialCode: "54" },
    { name: "Chile", code: "+56", iso: "cl", dialCode: "56" },
    { name: "Colombia", code: "+57", iso: "co", dialCode: "57" },
    { name: "Peru", code: "+51", iso: "pe", dialCode: "51" },
    { name: "Venezuela", code: "+58", iso: "ve", dialCode: "58" },
];

/**
 * PhoneInput Component
 * A phone number input with country code selector and auto-detection
 * 
 * @param {string} value - The phone number value
 * @param {function} onChange - Callback when value changes (receives full phone number with code)
 * @param {function} onCountryChange - Callback when country changes (receives country object)
 * @param {string} placeholder - Placeholder text
 * @param {string} defaultCountry - Default country code (e.g., "91" for India)
 */
const PhoneInput = ({
    value = "",
    onChange,
    onCountryChange,
    placeholder = "Phone number",
    defaultCountry = "91" // US/Canada by default
}) => {
    const [selectedCountry, setSelectedCountry] = useState(
        countries.find(c => c.dialCode === defaultCountry) || countries[0]
    );
    const [phoneNumber, setPhoneNumber] = useState(value);
    const [isDropdownOpen, setIsDropdownOpen] = useState(false);
    const [searchTerm, setSearchTerm] = useState("");
    const dropdownRef = useRef(null);

    // Close dropdown when clicking outside
    useEffect(() => {
        const handleClickOutside = (event) => {
            if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
                setIsDropdownOpen(false);
                setSearchTerm("");
            }
        };

        if (isDropdownOpen) {
            document.addEventListener('mousedown', handleClickOutside);
        }

        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
        };
    }, [isDropdownOpen]);

    // Auto-detect country from typed code
    const handlePhoneChange = (e) => {
        let input = e.target.value;
        setPhoneNumber(input);

        // Check if input starts with + and try to match country code
        if (input.startsWith('+')) {
            // Try to find matching country code
            for (let i = input.length; i > 0; i--) {
                const potentialCode = input.substring(1, i);
                const matchedCountry = countries.find(c => c.dialCode === potentialCode);

                if (matchedCountry) {
                    setSelectedCountry(matchedCountry);
                    if (onCountryChange) {
                        onCountryChange(matchedCountry);
                    }
                    // Remove the country code from display and show it in the dropdown
                    const numberWithoutCode = input.substring(i).trim();
                    setPhoneNumber(numberWithoutCode);
                    input = numberWithoutCode;
                    break;
                }
            }
        }

        // Call onChange with full number including country code
        if (onChange) {
            const fullNumber = input ? `${selectedCountry.code}${input}` : '';
            onChange(fullNumber);
        }
    };

    const handleCountrySelect = (country) => {
        setSelectedCountry(country);
        setIsDropdownOpen(false);
        setSearchTerm("");

        if (onCountryChange) {
            onCountryChange(country);
        }

        // Update the full phone number
        if (onChange && phoneNumber) {
            onChange(`${country.code}${phoneNumber}`);
        }
    };

    // Filter countries based on search
    const filteredCountries = countries.filter(country =>
        country.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        country.code.includes(searchTerm) ||
        country.dialCode.includes(searchTerm)
    );

    return (
        <div className="relative">
            <div className="flex gap-0">
                {/* Country Selector */}
                <div className="relative" ref={dropdownRef}>
                    <button
                        type="button"
                        onClick={() => setIsDropdownOpen(!isDropdownOpen)}
                        className="h-10 px-3 flex items-center gap-2 rounded-l-md border border-r-0 border-[var(--border-color)] bg-[var(--card-bg)] text-[var(--dashboard-text)] hover:bg-[var(--dashboard-secondary)] transition-colors focus:outline-none focus:ring-2 focus:ring-[var(--dashboard-primary)]"
                    >
                        <img
                            src={`https://flagcdn.com/w40/${selectedCountry.iso}.png`}
                            srcSet={`https://flagcdn.com/w80/${selectedCountry.iso}.png 2x`}
                            width="24"
                            alt={selectedCountry.name}
                            className="rounded-sm object-cover"
                        />
                        <span className="hidden sm:inline text-sm min-w-[3ch]">{selectedCountry.code}</span>
                        <ChevronDown className="h-4 w-4 text-[var(--dashboard-text-light)]" />
                    </button>

                    {/* Dropdown */}
                    {isDropdownOpen && (
                        <div className="absolute top-full left-0 mt-1 w-80 max-h-80 overflow-hidden rounded-lg border border-[var(--border-color)] bg-[var(--card-bg)] shadow-lg z-50 animate-in fade-in slide-in-from-top-2 duration-200">
                            {/* Search */}
                            <div className="p-2 border-b border-[var(--border-color)] sticky top-0 bg-[var(--card-bg)]">
                                <div className="relative">
                                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-[var(--dashboard-text-light)]" />
                                    <Input
                                        type="text"
                                        placeholder="Search country..."
                                        value={searchTerm}
                                        onChange={(e) => setSearchTerm(e.target.value)}
                                        className="pl-9 h-9 bg-[var(--dashboard-secondary)] border-[var(--border-color)] text-[var(--dashboard-text)]"
                                    />
                                </div>
                            </div>

                            {/* Country List */}
                            <div className="overflow-y-auto max-h-64">
                                {filteredCountries.length > 0 ? (
                                    filteredCountries.map((country, index) => (
                                        <button
                                            key={index}
                                            type="button"
                                            onClick={() => handleCountrySelect(country)}
                                            className={`w-full px-4 py-2 flex items-center gap-3 hover:bg-[var(--dashboard-secondary)] transition-colors text-left ${selectedCountry.dialCode === country.dialCode
                                                ? 'bg-[var(--dashboard-primary)]/10'
                                                : ''
                                                }`}
                                        >
                                            <img
                                                src={`https://flagcdn.com/w40/${country.iso}.png`}
                                                srcSet={`https://flagcdn.com/w80/${country.iso}.png 2x`}
                                                width="24"
                                                alt={country.name}
                                                className="rounded-sm object-cover"
                                            />
                                            <span className="flex-1 text-sm text-[var(--dashboard-text)]">
                                                {country.name}
                                            </span>
                                            <span className="text-sm text-[var(--dashboard-text-light)]">
                                                {country.code}
                                            </span>
                                        </button>
                                    ))
                                ) : (
                                    <div className="px-4 py-3 text-sm text-[var(--dashboard-text-light)] text-center">
                                        No countries found
                                    </div>
                                )}
                            </div>
                        </div>
                    )}
                </div>

                {/* Phone Number Input */}
                <Input
                    type="tel"
                    value={phoneNumber}
                    onChange={handlePhoneChange}
                    placeholder={placeholder}
                    className="flex-1 !h-10 rounded-l-none border-[var(--border-color)] bg-[var(--card-bg)] text-[var(--dashboard-text)]"
                />
            </div>
        </div>
    );
};

export default PhoneInput;
