import React, { useState , useEffect } from 'react'
import EnhancedTable from '../Components/CommonElements/Table'
import AuthService from '../Components/Service/AuthService'
import { userStore } from '../Stores/UserStore'
import { useCategoryStore } from '../Stores/CategoryStore'
import { FaArrowLeft } from "react-icons/fa";

const Categories = () => {

   // Destructure values from userStore and useCategoryStore
   const { token, userData } = userStore();
   const { categories, updateCategories } = useCategoryStore();

   // State variables
   const [selected, setSelected] = useState([]); // Selected category IDs
   const [loading, setLoading] = useState(true); // Loading state
   const [newCategoryName, setNewCategoryName] = useState(''); // New category name input value
   const [isFormVisible, setIsFormVisible] = useState(false); // Visibility of add/edit category form
   const [isSelected, setIsSelected] = useState(false); // Flag indicating if a category is selected for editing
   const [categoriesState, setCategoriesState] = useState([]); // Categories state variable



    const handleCategorySelectionChange = (selectedCategoryIds) => {
        setSelected(selectedCategoryIds);
      };

      // Table head cells configuration
    const headCells = [
      {
        id: 'name',
        numeric: false,
        disablePadding: true,
        label: 'Title',
      },
      {
        id: 'number_tasks',
        numeric: true,
        disablePadding: false,
        label: '# Tasks',
      }
    ];

     // Fetch categories and associated tasks on component mount or when token or categories change
    useEffect(() => {
      fetchCategories();
    }, []);
    
    useEffect(() => {
      setCategoriesState(categories);
    }, [token, categories]);

    
    // Function to fetch categories and update state
    const fetchCategories = async () => {
      try {
          const allCategories = await AuthService.getAllCategories(token);
          
          // Check if allCategories is not undefined before mapping over it
          if (allCategories !== undefined) {
              const categoriesWithTasks = await Promise.all(
                  allCategories.map(async (category) => {
                      const tasks = await AuthService.getTasksByCategories(token, category.name);
                      return { ...category, number_tasks: tasks.length };
                  })
              );
              
              updateCategories(categoriesWithTasks);
          } else {
              console.error('Error: Categories data is undefined');
          }
          
          setLoading(false);
      } catch (error) {
          console.error('Error fetching data:', error);
      }
    };


    // Function to handle submission of new category
    const handleNewCategorySubmit = async (event) => {
        event.preventDefault();

        try {
            const response = await AuthService.newCategory(token, { name: newCategoryName });
            
            if (response.status === 201) {
                // Limpar o campo de entrada
                setNewCategoryName('');
                // Atualizar a lista de categorias
                const updatedCategories = await AuthService.getAllCategories(token);
                updateCategories(updatedCategories);
                setIsFormVisible(false);
            }
        } catch (error) {
            console.error('Error creating new category:', error);
        }
    };


    // Function to handle deletion of selected categories
    const handleDeleteSelectedCategories = async () => {

      let response;

        try {
          await Promise.all(
            selected.map(async (categoryId) => {
              response = await AuthService.deleteCategory(token, categoryId);
            })
          );
      
          if(response.status === 200){
            await fetchCategories();
          }
          

          } catch (error) {
          console.error('Error deleting categories:', error);
          }
    };


    // Function to handle submission of edited category
    const handleEditCategorySubmit = async (event) => {

      event.preventDefault();

      try {
   
        const categoryToEdit = categories.find(category => selected.includes(category.id));
    
        if (categoryToEdit) {
   
          const response = await AuthService.editCategory(token, categoryToEdit.name, newCategoryName);
    
          if (response.status === 200) {
            
            setNewCategoryName('');
        
            setIsFormVisible(false);
          }
        }
      } catch (error) {
        console.error('Error editing category:', error);
      }
    };


    // Function to handle hiding the add/edit category form
    const handleFormToNotVisible = () => {
      setIsFormVisible(false);
    }


    // Function to handle showing the add category form
    const handleChangeAddCategory  = () => {
      setIsFormVisible(true);
      setIsSelected(false);
      setSelected([]);
    };


     // Function to handle showing the edit category form
    const handleChangeEditForm = () => {
          setIsFormVisible(true);
          setIsSelected(true);
    };


    return (
        <div className='categories'>
          { isFormVisible && (
          
            <div className='container-addCategoriesForm'>
          
              <span onClick={handleFormToNotVisible}> <FaArrowLeft /> </span>
              {isSelected && (
                <form className={`editCateg-form ${isSelected ? 'active' : ''}`} onSubmit={handleEditCategorySubmit}>
                  <input
                      type="text"
                      placeholder="New category name"
                      value={newCategoryName}
                      onChange={(e) => setNewCategoryName(e.target.value)}
                  />
                  <button type="submit">Save Changes</button>
              </form>
              )}
              {!isSelected && (
                <form className={`addCateg-form ${!isSelected ? 'active' : ''}`} onSubmit={handleNewCategorySubmit}>
                  <input
                      type="text"
                      placeholder="New category name"
                      value={newCategoryName}
                      onChange={(e) => setNewCategoryName(e.target.value)}
                  />
                  <button type="submit">Add Category</button>
              </form>)}
            </div>)}
          
            <div className='categories-table-container'>
                {loading ? (
                    <div>Loading...</div>
                ) : (
                    <div className="categories-table">
                        <EnhancedTable 
                            dataType="Categories"
                            typeOfUser={userData.typeOfUser}
                            headCells={headCells}
                            data={categoriesState}
                            onDeleteSelected={handleDeleteSelectedCategories}
                            onSelectionChange={handleCategorySelectionChange}
                            onAddChange={handleChangeAddCategory}
                            onEditSelect={handleChangeEditForm}
                            />
                    </ div>
                )}
            </div>
        </div>
    );
};

export default Categories;