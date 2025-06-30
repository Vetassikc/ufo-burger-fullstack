"use client";
import { useEffect, useState } from 'react';
import { supabase } from '@/lib/supabaseClient';
import { useRouter } from 'next/navigation';
import styles from '@/styles/AdminMenuPage.module.scss';
import MenuItemForm from '@/components/MenuItemForm'; // Імпортуємо нашу нову форму

const AdminMenuPage = () => {
  const [menuItems, setMenuItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  // Стани для модального вікна
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editingItem, setEditingItem] = useState(null); // Тут буде страва для редагування

  // Функція для завантаження меню
  const fetchMenuItems = async () => {
    const { data, error } = await supabase
      .from('menu_items')
      .select('*')
      .order('category');

    if (error) console.error('Error fetching menu items', error);
    else setMenuItems(data);
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

  // Функція для видалення страви
  const handleDelete = async (id) => {
    if (window.confirm('Ви впевнені, що хочете видалити цю страву?')) {
      const { error } = await supabase
        .from('menu_items')
        .delete()
        .eq('id', id);

      if (error) {
        alert('Помилка видалення страви.');
        console.error(error);
      } else {
        // Оновлюємо список страв, прибираючи видалену
        setMenuItems(menuItems.filter(item => item.id !== id));
      }
    }
  };


  // ФУНКЦІЯ ДЛЯ ЗБЕРЕЖЕННЯ (створення або оновлення)
  const handleSave = async (itemData) => {
    let error;
    if (itemData.id) {
      // Оновлення існуючої страви
      ({ error } = await supabase.from('menu_items').update(itemData).eq('id', itemData.id));
    } else {
      // Створення нової страви
      const { id, ...newItemData } = itemData; // Видаляємо id, бо він генерується автоматично
      ({ error } = await supabase.from('menu_items').insert([newItemData]));
    }

    if (error) {
      alert('Помилка збереження даних.');
      console.error(error);
    } else {
      setIsFormOpen(false); // Закриваємо вікно
      await fetchMenuItems(); // Оновлюємо список страв
    }
  };

  const openFormForNew = () => {
    setEditingItem(null); // Очищуємо дані для редагування
    setIsFormOpen(true);
  };

  const openFormForEdit = (item) => {
    setEditingItem(item); // Передаємо дані страви у форму
    setIsFormOpen(true);
  };

  if (loading) return <p className={styles.loading}>Завантаження меню...</p>;

  return (
    <div>
      <div className={styles.pageHeader}>
        <h2>Керування меню</h2>
        <button onClick={openFormForNew} className={styles.addBtn}>+ Додати страву</button>
      </div>
      <table className={styles.menuTable}>
        {/* ... ваша таблиця ... */}
        <tbody>
          {menuItems.map(item => (
            <tr key={item.id}>
              <td>{item.name}</td>
              <td>{item.category}</td>
              <td>{item.price} CHF</td>
              <td>
                <button onClick={() => openFormForEdit(item)} className={styles.editBtn}>Редагувати</button>
                <button onClick={() => handleDelete(item.id)} className={styles.deleteBtn}>Видалити</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      {/* Умовний рендеринг модального вікна */}
      {isFormOpen && (
        <MenuItemForm 
          initialData={editingItem}
          onSave={handleSave}
          onCancel={() => setIsFormOpen(false)}
        />
      )}
    </div>
  );
};

export default AdminMenuPage;