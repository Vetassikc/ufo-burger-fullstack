// src/app/admin/menu/page.tsx

"use client";
import { useEffect, useState } from 'react';
import { supabase } from '@/lib/supabaseClient';
import { useRouter } from 'next/navigation';
import styles from '@/styles/AdminMenuPage.module.scss';
// Імпортуємо компонент форми та його типи
import MenuItemForm, { MenuItemDB, MenuItemFormState } from '@/components/MenuItemForm';

const AdminMenuPage = () => {
  // 1. Типізуємо state
  const [menuItems, setMenuItems] = useState<MenuItemDB[]>([]); // Використовуємо MenuItemDB
  const [loading, setLoading] = useState<boolean>(true);
  const router = useRouter();

  // Стани для модального вікна
  const [isFormOpen, setIsFormOpen] = useState<boolean>(false);
  const [editingItem, setEditingItem] = useState<MenuItemDB | null>(null); // Тип MenuItemDB

  // Функція для завантаження меню
  const fetchMenuItems = async () => {
    // 2. Типізуємо відповідь від Supabase
    const { data, error } = await supabase
      .from('menu_items')
      .select('*')
      .order('category')
      .returns<MenuItemDB[]>(); // Чітко вказуємо тип, який очікуємо

    if (error) console.error('Error fetching menu items', error);
    else if (data) setMenuItems(data);
  };

  // Перевірка користувача та завантаження даних
  useEffect(() => {
    const checkUserAndFetch = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) {
        router.push('/login');
      } else {
        await fetchMenuItems();
      }
      setLoading(false);
    };
    checkUserAndFetch();
  }, [router]);

  // 3. Типізуємо 'id'
  const handleDelete = async (id: number) => {
    if (window.confirm('Ви впевнені, що хочете видалити цю страву?')) {
      const { error } = await supabase
        .from('menu_items')
        .delete()
        .eq('id', id);

      if (error) {
        alert('Помилка видалення страви.');
        console.error(error);
      } else {
        setMenuItems(menuItems.filter(item => item.id !== id));
      }
    }
  };

  // 4. Типізуємо 'itemData' (дані з форми) та конвертуємо їх
  const handleSave = async (itemData: MenuItemFormState) => {
    
    // Конвертуємо дані з форми (де 'price' - string) у дані для БД (де 'price' - number)
    const dataToSave = {
      ...itemData,
      price: parseFloat(itemData.price), // Конвертація string -> number
      image_url: itemData.image_url || null, // Забезпечуємо null замість ''
    };

    let error;
    if (dataToSave.id) {
      // Оновлення існуючої страви
      ({ error } = await supabase.from('menu_items')
          .update(dataToSave)
          .eq('id', dataToSave.id));
    } else {
      // Створення нової страви
      const { id, ...newItemData } = dataToSave; // Видаляємо id
      ({ error } = await supabase
          .from('menu_items')
          .insert([newItemData])); // Supabase очікує масив
    }

    if (error) {
      alert('Помилка збереження даних.');
      console.error(error);
    } else {
      setIsFormOpen(false); 
      setEditingItem(null); // Очищуємо стан редагування
      await fetchMenuItems(); // Оновлюємо список
    }
  };

  const openFormForNew = () => {
    setEditingItem(null); 
    setIsFormOpen(true);
  };

  // 5. Типізуємо 'item'
  const openFormForEdit = (item: MenuItemDB) => {
    setEditingItem(item); 
    setIsFormOpen(true);
  };

  if (loading) return <p className={styles.loading}>Завантаження меню...</p>;

  return (
    // Використовуємо div-обгортку, як в оригіналі
    <div> 
      <div className={styles.pageHeader}>
        <h2>Керування меню</h2>
        <button onClick={openFormForNew} className={styles.addBtn}>+ Додати страву</button>
      </div>
      <table className={styles.menuTable}>
        <thead>
          <tr>
            <th>Назва</th>
            <th>Категорія</th>
            <th>Ціна</th>
            <th>Дії</th>
          </tr>
        </thead>
        <tbody>
          {menuItems.map(item => (
            <tr key={item.id}>
              <td>{item.name}</td>
              <td>{item.category}</td>
              <td>{item.price.toFixed(2)} CHF</td> {/* Форматуємо ціну */}
              <td>
                <button onClick={() => openFormForEdit(item)} className={styles.editBtn}>Редагувати</button>
                <button onClick={() => handleDelete(item.id)} className={styles.deleteBtn}>Видалити</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      {isFormOpen && (
        <MenuItemForm 
          initialData={editingItem}
          onSave={handleSave}
          onCancel={() => {
            setIsFormOpen(false);
            setEditingItem(null); // Також очищуємо при скасуванні
          }}
        />
      )}
    </div>
  );
};

export default AdminMenuPage;