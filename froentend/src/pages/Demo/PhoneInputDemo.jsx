import React, { useState } from 'react';
import PhoneInput from '../components/common/PhoneInput';

/**
 * Demo page to showcase PhoneInput component
 * This can be removed from production - it's just for demonstration
 */
const PhoneInputDemo = () => {
    const [phone1, setPhone1] = useState('');
    const [phone2, setPhone2] = useState('');
    const [phone3, setPhone3] = useState('');

    return (
        <div className="container mx-auto p-8">
            <div className="max-w-2xl mx-auto space-y-8">
                <div>
                    <h1 className="text-3xl font-bold text-[var(--dashboard-text)] mb-2">
                        PhoneInput Component Demo
                    </h1>
                    <p className="text-[var(--dashboard-text-light)]">
                        A phone number input with country flag dropdown and auto-detection
                    </p>
                </div>

                <div className="space-y-6 bg-[var(--card-bg)] p-6 rounded-xl border border-[var(--border-color)]">
                    <h2 className="text-xl font-semibold text-[var(--dashboard-text)]">Examples</h2>

                    {/* Example 1: Default (US) */}
                    <div className="space-y-2">
                        <label className="text-sm font-medium text-[var(--dashboard-text)]">
                            Default (United States)
                        </label>
                        <PhoneInput
                            value={phone1}
                            onChange={setPhone1}
                            placeholder="Phone number"
                            defaultCountry="1"
                        />
                        <p className="text-xs text-[var(--dashboard-text-light)]">
                            Value: {phone1 || 'No value'}
                        </p>
                    </div>

                    {/* Example 2: India */}
                    <div className="space-y-2">
                        <label className="text-sm font-medium text-[var(--dashboard-text)]">
                            India Default
                        </label>
                        <PhoneInput
                            value={phone2}
                            onChange={setPhone2}
                            placeholder="Phone number"
                            defaultCountry="91"
                        />
                        <p className="text-xs text-[var(--dashboard-text-light)]">
                            Value: {phone2 || 'No value'}
                        </p>
                    </div>

                    {/* Example 3: UK */}
                    <div className="space-y-2">
                        <label className="text-sm font-medium text-[var(--dashboard-text)]">
                            United Kingdom Default
                        </label>
                        <PhoneInput
                            value={phone3}
                            onChange={setPhone3}
                            placeholder="Phone number"
                            defaultCountry="44"
                        />
                        <p className="text-xs text-[var(--dashboard-text-light)]">
                            Value: {phone3 || 'No value'}
                        </p>
                    </div>
                </div>

                {/* Features */}
                <div className="space-y-4 bg-[var(--card-bg)] p-6 rounded-xl border border-[var(--border-color)]">
                    <h2 className="text-xl font-semibold text-[var(--dashboard-text)]">Features</h2>
                    <ul className="space-y-2 text-sm text-[var(--dashboard-text-light)]">
                        <li className="flex items-start gap-2">
                            <span className="text-green-500 mt-1">✓</span>
                            <span><strong>Country selection:</strong> Click the flag to open a dropdown with 45+ countries</span>
                        </li>
                        <li className="flex items-start gap-2">
                            <span className="text-green-500 mt-1">✓</span>
                            <span><strong>Search:</strong> Search countries by name or code in the dropdown</span>
                        </li>
                        <li className="flex items-start gap-2">
                            <span className="text-green-500 mt-1">✓</span>
                            <span><strong>Auto-detection:</strong> Type +91, +44, etc., and the flag automatically changes</span>
                        </li>
                        <li className="flex items-start gap-2">
                            <span className="text-green-500 mt-1">✓</span>
                            <span><strong>Smart formatting:</strong> Automatically removes country code from input when detected</span>
                        </li>
                        <li className="flex items-start gap-2">
                            <span className="text-green-500 mt-1">✓</span>
                            <span><strong>Theme-compatible:</strong> Supports light and dark modes</span>
                        </li>
                    </ul>
                </div>

                {/* Usage */}
                <div className="space-y-4 bg-[var(--card-bg)] p-6 rounded-xl border border-[var(--border-color)]">
                    <h2 className="text-xl font-semibold text-[var(--dashboard-text)]">Usage</h2>
                    <div className="bg-[var(--dashboard-secondary)] p-4 rounded-lg">
                        <pre className="text-xs text-[var(--dashboard-text)] overflow-x-auto">
                            {`import PhoneInput from '../components/common/PhoneInput';

const [phone, setPhone] = useState('');

<PhoneInput
    value={phone}
    onChange={setPhone}
    placeholder="Phone number"
    defaultCountry="91"  // India
/>`}
                        </pre>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default PhoneInputDemo;
