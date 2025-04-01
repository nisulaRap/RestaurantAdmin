import React from 'react'
import './Addmenu.css'
import { assets } from '../../assets/assets'

const Addmenu = () => {
  return (
    <div className='add'>
        <form className='flex-col'>
            <div className='add-img-upload flex-col'>
                <p>Upload Image</p>
                <label htmlFor='image'>
                    <img src={assets.upload_icon} alt='' />
                </label>
                <input type='file' id='image' hidden required />
            </div>
            <div className='add-product-name flex-col'>
                <p>Product Name</p>
                <input type='text' name='name' placeholder='Enter Product Name' required />
            </div>
            <div className="add-product-description flex-col">
                <p>Product Decsription</p>
                <textarea name='description' rows='10' placeholder='Enter Product Description' required></textarea>
            </div>
            <div className='add-category-price'>
                <div className='add-category flex-col'>
                    <p>Category</p>
                    <select name='category' required>
                        <option value=''>Select Category</option>
                        <option value='Sides'>Sides</option>
                        <option value='Pizza'>Pizza</option>
                        <option value='Dessert'>Dessert</option>
                        <option value='Beverage'>Beverage</option>
                        <option value='Soup'>Soup</option>
                    </select>
                </div>
                <div className='add-price flex-col'>
                    <p>Price</p>
                    <input type='number' name='price' placeholder='Enter Price' required />
                </div>
            </div>
            <button type='submit' className='add-btn'>ADD</button>
        </form>
    </div>
  )
}

export default Addmenu