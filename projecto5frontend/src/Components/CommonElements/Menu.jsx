import React, { useRef, useState, useEffect, createRef } from "react";
import gsap from "gsap";
import { userStore } from '../../Stores/UserStore'
import { IoMdArrowDropdown } from "react-icons/io";
import { useNavigate } from 'react-router-dom';
import languages from "../../Translations"; 
import { IntlProvider, FormattedMessage } from "react-intl";

const Menu = ({ items, typeOfUser }) => {
    // References for DOM elements
    const $root = useRef();
    const $indicator1 = useRef();
    const $indicator2 = useRef();
    const $items = useRef(items.map(createRef));
    const {locale} = userStore();
    // State variables
    const [active, setActive] = useState(null);
    const [submenuItems, setSubmenuItems] = useState([]);
    const [submenuVisible, setSubmenuVisible] = useState(false); // New state for submenu visibility
    // Navigation hook
    const navigate = useNavigate();

    // Function to handle click on menu items
    const handleMenuItemClick = (index) => {
        if (active === index) {
            setActive(null);
            setSubmenuVisible(false); // Hide submenu when clicking again on the active item
        } else {
            setActive(index);
            setSubmenuItems(items[index].submenu || []);
            setSubmenuVisible(true); // Show submenu on click
        }
    };

    // Function to handle hover on menu items
    const handleMenuItemHover = (index) => {
        setActive(index);
        setSubmenuItems(items[index].submenu || []);
        setSubmenuVisible(true); // Show submenu on hover
    }

    // Function to handle mouse leave from menu item
    const handleMenuItemMouseLeave = () => {
        setActive(null);
        setSubmenuVisible(false); // Hide submenu on mouse leave
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
        <IntlProvider locale={locale} messages={languages[locale]}>
        <div ref={$root} className="menu">
            {/* Mapping through menu items */}
            {items.map((item, index) => (
                <div key={item.name} className="menu-item" onMouseEnter={() => handleMenuItemHover(index)} onMouseLeave={handleMenuItemMouseLeave} onClick={() => handleMenuItemClick(index)}>
                    {/* Conditional rendering based on user type and item type */}
                    {(item.name === "board" 
                    || item.name === "users"
                    || (item.name === "categories" && typeOfUser === 300)
                    || (item.name === "dashboard" && typeOfUser === 300) ) && (
                        <a
                            ref={$items.current[index]}
                            className={`item ${active === index ? "active" : ""}`}
                            onClick={() => navigate(item.path)}
                            aria-label={item.name}
                        >
                            <span className="container-item">
                                <FormattedMessage id={item.name} />
                                {!(item.name === "categories" || item.name === "dashboard" || (item.name === "users" && typeOfUser === 200) || (item.name === "users" && typeOfUser === 100)) && (
                                    <IoMdArrowDropdown />
                                )}                        
                            </span>
                        </a>
                    )}
                    {/* Submenu rendering */}
                    {(active === index && (item.name === "board" || (item.name === "users" && typeOfUser !== 100) || (item.name === "categories" && typeOfUser === 300))) && (
                        <div className="submenu" style={{cursor: 'pointer'}}>
                            {submenuItems.map((submenuItem, index) => (
                                <div key={index} className="submenu-item">
                                    <a onClick={() => navigate(submenuItem.path)}><FormattedMessage id={submenuItem.name} /></a>
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
        </IntlProvider>
    );
};

export default Menu;