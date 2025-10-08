'use client'

import { EyeIcon, EyeSlashIcon } from '@heroicons/react/24/outline';
import React, { useState } from 'react'

type TInputField = {
    name?: string;
    type: 'text' | 'email' | 'password' | 'date' | 'number' | 'tel' | 'textarea';
    placeholder: string;
    id?: string;
    value?: string | null | undefined | number | FormDataEntryValue;
    icon?: React.ElementType;
    errors?: any;
    disabled?: boolean;
    className?: string;
    label?: string;
    min?: string | number | undefined;
    readOnly?: boolean;
    onChange?: (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => void;
};

export default function InputBox({ name, type, id, value, placeholder, icon, errors, disabled = false, className = '', label, onChange, min, readOnly }: TInputField) {
    const [isPassVisible, setIsPassVisible] = useState(false);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        if (onChange) {
            onChange(e);
        }
    };


    const defaultValue = value !== null && value !== undefined ? String(value) : '';

    return (
        <div className='flex-1'>
            <div className={`relative ${errors && 'has-error'}`}>

                {/* {label && <label htmlFor={id} className='pl-2'>{label}</label>} */}
                {label && <label htmlFor={id} className=''>{label}</label>}

                {icon && (
                    <div className='absolute inset-y-0 left-0 flex items-center pl-2 pointer-events-none'>
                        {React.createElement(icon)}
                    </div>
                )}

                {type === 'textarea' ? (
                    <textarea
                        name={name}
                        placeholder={placeholder}
                        defaultValue={defaultValue}
                        id={id}
                        disabled={disabled}
                        // readOnly={readOnly}
                        className={`form-textarea placeholder:text-gray-400  ${className}`}
                        onChange={handleChange}
                    />
                ) : (
                    <input
                        name={name}
                        type={isPassVisible ? 'text' : type}
                        placeholder={placeholder}
                        defaultValue={defaultValue}
                        id={id}
                        disabled={disabled}
                        readOnly={readOnly}
                        className={`form-input placeholder:text-gray-400  ${className}`}
                        onChange={handleChange}
                        min={
                            type === 'number'
                                ? min ? min : 0
                                : type === 'date'
                                    ? (typeof min === 'string' ? min : undefined)
                                    : undefined
                        }
                    />
                )}

                {
                    type === 'password' && (
                        isPassVisible ? (
                            <EyeSlashIcon
                                className="absolute text-gray-500 size-5 top-[8px] right-2 cursor-pointer"
                                onClick={() => setIsPassVisible(false)}
                            />
                        ) : (
                            <EyeIcon
                                className="absolute text-gray-500 size-5 top-[8px] right-2 cursor-pointer"
                                onClick={() => setIsPassVisible(true)}
                            />
                        )
                    )
                }
            </div>

            {
                errors && errors.map((error: string, index: number) => (
                    <p key={index} className='text-red-500 pt-1 text-sm'>- {error}</p>
                ))
            }
        </div>

    )
}
