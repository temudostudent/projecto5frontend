import React, { useRef, useState, useEffect, createRef } from "react";
import gsap from "gsap";
import { IoMdArrowDropdown } from "react-icons/io";
import { useNavigate } from 'react-router-dom';

const Menu = ({ items, typeOfUser }) => {
    // References for DOM elements
    const $root = useRef();
    const $indicator1 = useRef();
    const $indicator2 = useRef();
    const $items = useRef(items.map(createRef));
    // State variables
    const [active, setActive] = useState(null);
    const [submenuItems, setSubmenuItems] = useState([]);
    // Navigation hook
    const navigate = useNavigate();

    // Function to handle click on menu items
    const handleMenuItemClick = (index) => {
        if (active === index) {
            setActive(null);
        } else {
            setActive(index);
            setSubmenuItems(items[index].submenu || []);
        }
    };

    // Function to handle hover on menu items
    const handleMenuItemHover = (index) => {
        setActive(index);
        setSubmenuItems(items[index].submenu || []);
    }

    // Animation function to animate the active menu item
    const animate = () => {
        if (active !== null) {
            const menuOffset = $root.current.getBoundingClientRect();
            const activeItem = $items.current[active].current;
            const { width, height, top, left } = activeItem.getBoundingClientRect();
            const paddingVertical = 25;

            const settings = {
                x: left - menuOffset.x,
                y: top - menuOffset.y + paddingVertical,
                width: width,
                height: height - paddingVertical * 2,
                backgroundColor: items[active].color,
                ease: "elastic.out(.7, .7)",
                duration: 0.8
            };

            gsap.to($indicator1.current, { ...settings });
            gsap.to($indicator2.current, { ...settings, duration: 1 });
        }
    };

    useEffect(() => {
        animate();
        window.addEventListener("resize", animate);

        return () => {
            window.removeEventListener("resize", animate);
        };
    }, [active]);

    return (
        <div ref={$root} className="menu">
            {/* Mapping through menu items */}
            {items.map((item, index) => (
                <div key={item.name} className="menu-item" onMouseEnter={() => handleMenuItemHover(index)} onClick={() => handleMenuItemClick(index)}>
                    {/* Conditional rendering based on user type and item type */}
                    {(item.name === "Board" 
                    || (item.name === "Users" && typeOfUser !== 100) 
                    || (item.name === "Categories" && typeOfUser === 300)
                    || (item.name === "Dashboard" && typeOfUser === 300) ) && (
                        <a
                            ref={$items.current[index]}
                            className={`item ${active === index ? "active" : ""}`}
                            onClick={() => navigate(item.path)}
                            aria-label={item.name}
                        >
                            <span className="container-item">
                                {item.name} 
                                {!(item.name === "Categories" || item.name === "Dashboard" || (item.name === "Users" && typeOfUser === 200)) && (
                                    <IoMdArrowDropdown />
                                )}                        
                            </span>
                        </a>
                    )}
                    {/* Submenu rendering */}
                    {(active === index && (item.name === "Board" || (item.name === "Users" && typeOfUser !== 100) || (item.name === "Categories" && typeOfUser === 300))) && (
                        <div className="submenu" style={{cursor: 'pointer'}}>
                            {submenuItems.map((submenuItem, index) => (
                                <div key={index} className="submenu-item">
                                    <a onClick={() => navigate(submenuItem.path)}>{submenuItem.name}</a>
                                </div>
                            ))}
                        </div>
                    )}
                </div>
            ))}
            {/* Indicator for active menu item */}
            <div ref={$indicator1} className="indicator" />
            <div ref={$indicator2} className="indicator" />
        </div>
    );
};

export default Menu;