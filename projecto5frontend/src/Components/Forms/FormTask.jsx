import React, { useState, useEffect} from "react"
import './FormStyle.css'

const FormTask = (props) => {

    // Destructuring props
    const { title, inputs, buttonText, onSubmit, initialValues } = props;
    
    // State variable for form data
    const [formData, setFormData] = useState(initialValues || {
        category: { name: '', disabled: true }, 
        priority: { value: '', disabled: true }
    });

    const thisInitialValues = {
        title: '',
        description: '',
        priority: '',
        startDate: '',
        limitDate: '',
        category: { name: '' }
    };

    // useEffect to update form data when initialValues change
    useEffect(() => {
        setFormData(initialValues || {
            category: { name: '', disabled: true }, 
            priority: { value: '', disabled: true } 
        });
      }, [initialValues]);

      // Function to handle changes in form inputs
      const handleChange = (event) => {
        const { name, value } = event.target;

        // Special handling for category input (category is an object)
        if (name === 'category') {
            
            setFormData(prevState => ({
                ...prevState,
                category: { name: value }
            }));
        } else {
            // For other inputs, update state as usual
            setFormData(prevState => ({
                ...prevState,
                [name]: value
            }));
        }
    };

    // Function to handle form submission
    const handleSubmitTask = async (event) => {
        event.preventDefault();
        try {

            if (onSubmit) {
                // Formatting data before submitting
                const categoryName = formData.category && formData.category.name;
                const categoryObject = categoryName ? { name: categoryName } : null;
                const formattedData = {
                    title: formData.title,
                    description: formData.description,
                    priority: isNaN(formData.priority) ? 300 : parseInt(formData.priority),
                    startDate: formData.startDate,
                    limitDate: formData.limitDate,
                    category: categoryObject === null ? formData.category.name : categoryObject
                };

                await onSubmit(formattedData);

                console.log(formattedData);
                // Clearing form data after submission
                setFormData(thisInitialValues);

            }
        } catch (error) {
            console.error('Erro ao criar tarefa:', error);
            
        }
    };


    // Function to create input elements based on input configuration
    const createInput = (input) => {
        const { type, name, placeholder, options, label } = input;
        if (type === 'select' && name === 'category') {
            // Special handling for category select input
            return (
                <select 
                    name={name} 
                    required={input.required}
                    onChange={handleChange}
                    value={(formData && formData.category ? formData.category.name : '')}
                >
                    {options.map((option, index) => (
                        <option key={index} value={option.value} disabled={option.disabled}>{option.label}</option>
                    ))}
                </select>
            );
        } else if(type === 'select'){
            return (
                <select 
                    name={name} 
                    required={input.required}
                    onChange={handleChange}
                    value={formData[name]}
                >
                    {options.map((option, index) => (
                        <option key={index} value={option.value} disabled={option.disabled}>{option.label}</option>
                    ))}
                </select>
            );
        }else {
            return (
                <div className="container-withLabel">
                    <label htmlFor={name}>{label}</label>
                    <input 
                        type={type} 
                        name={name} 
                        id={name} 
                        placeholder={placeholder} 
                        required={input.required} 
                        onChange={handleChange} 
                        value={formData[name] || ''}
                    />
                </div>
            );
        }
    }


    return (
        <>
        <div className="form">
            <div className="form-content">
                
                <h2>{title}</h2>
                <form onSubmit={handleSubmitTask}>
                    {inputs.map((input, index) => (
                        <div key={index}>
                            {createInput(input)}
                        </div>
                    ))}
                    <button type="submit">{buttonText}</button>
                </form>
            </div>
        </div>
        </>
    );
}

export default FormTask;