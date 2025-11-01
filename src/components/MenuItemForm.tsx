// src/components/MenuItemForm.tsx

"use client";
import { useState, useEffect, ChangeEvent, FormEvent } from 'react';
import styles from '@/styles/AdminMenuPage.module.scss';

// --- Визначаємо типи ---

type MenuItemCategory = 'ufo' | 'smash' | 'side';

// Тип даних, як вони приходять з БД (для initialData)
export interface MenuItemDB {
  id: number;
  name: string;
  description: string;
  price: number;
  category: MenuItemCategory;
  image_url: string | null;
}

// ▼▼▼ ОСЬ ВИПРАВЛЕННЯ ▼▼▼
// Тип даних для стану нашої форми (price - це 'string' для input)
export interface MenuItemFormState { // <--- ДОДАНО EXPORT
  id?: number; 
  name: string;
  description: string;
  price: string;
  category: MenuItemCategory;
  image_url: string;
}
// ▲▲▲ КІНЕЦЬ ВИПРАВЛЕННЯ ▲▲▲


// Тип для пропсів компонента
interface MenuItemFormProps {
  initialData: MenuItemDB | null; 
  onSave: (item: MenuItemFormState) => void; 
  onCancel: () => void;
}

// Виносимо defaultState за межі компонента
const defaultState: MenuItemFormState = {
  name: '',
  description: '',
  price: '',
  category: 'ufo',
  image_url: '',
};

// --- Компонент ---

const MenuItemForm = ({ initialData, onSave, onCancel }: MenuItemFormProps) => {

  const [item, setItem] = useState<MenuItemFormState>(defaultState);

  useEffect(() => {
    if (initialData) {
      setItem({
        ...initialData,
        price: String(initialData.price),
        image_url: initialData.image_url || '',
      });
    } else {
      setItem(defaultState);
    }
  }, [initialData]);

  const handleChange = (e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    
    if (name === 'category') {
      setItem(prev => ({ ...prev, category: value as MenuItemCategory }));
    } else {
      setItem(prev => ({ ...prev, [name]: value }));
    }
  };

  const handleSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    onSave(item);
  };

  return (
    <div className={styles.modalOverlay}>
      <div className={styles.modalContent}>
        <h2>{initialData ? 'Редагувати страву' : 'Додати нову страву'}</h2>
        <form onSubmit={handleSubmit}>
          <input type="text" name="name" value={item.name} onChange={handleChange} placeholder="Назва страви" required />
          <textarea name="description" value={item.description} onChange={handleChange} placeholder="Опис" required rows={4} />
          <input type="number" name="price" value={item.price} onChange={handleChange} placeholder="Ціна (напр., 18)" required min="0" step="0.01" />
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