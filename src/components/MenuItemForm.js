"use client";
import { useState, useEffect } from 'react';
import styles from '@/styles/AdminMenuPage.module.scss'; // Будемо використовувати ті ж стилі

// `initialData` - дані для редагування; `onSave` - функція, що викликається при збереженні
const MenuItemForm = ({ initialData, onSave, onCancel }) => {
  const [item, setItem] = useState({ name: '', description: '', price: '', category: 'ufo', image_url: '' });

  useEffect(() => {
    if (initialData) {
      setItem(initialData); // Якщо є дані для редагування, заповнюємо форму
    }
  }, [initialData]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setItem(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onSave(item); // Викликаємо функцію збереження, передаючи дані з форми
  };

  return (
    <div className={styles.modalOverlay}>
      <div className={styles.modalContent}>
        <h2>{initialData ? 'Редагувати страву' : 'Додати нову страву'}</h2>
        <form onSubmit={handleSubmit}>
          <input type="text" name="name" value={item.name} onChange={handleChange} placeholder="Назва страви" required />
          <textarea name="description" value={item.description} onChange={handleChange} placeholder="Опис" required rows="4"></textarea>
          <input type="number" name="price" value={item.price} onChange={handleChange} placeholder="Ціна (напр., 18)" required />
          <select name="category" value={item.category} onChange={handleChange}>
            <option value="ufo">UFO-Бургер</option>
            <option value="smash">Смашбургер</option>
            <option value="side">Додаток/Напій</option>
          </select>
          <input type="text" name="image_url" value={item.image_url} onChange={handleChange} placeholder="URL зображення (напр., /img/new.jpg)" />
          <div className={styles.formActions}>
            <button type="button" onClick={onCancel} className={styles.cancelBtn}>Скасувати</button>
            <button type="submit" className={styles.saveBtn}>Зберегти</button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default MenuItemForm;