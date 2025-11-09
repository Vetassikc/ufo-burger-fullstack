// src/components/AnimatedSection.tsx
"use client"; // <-- ▼▼▼ ОСЬ ВИПРАВЛЕННЯ ▼▼▼

import { motion, Variants } from 'framer-motion';
import React from 'react';

// Типізуємо пропси
interface AnimatedSectionProps {
  children: React.ReactNode;
  className?: string;
}

// Визначаємо варіанти анімації
const sectionVariants: Variants = {
  // Початковий стан (невидимий, трохи нижче)
  hidden: { 
    opacity: 0, 
    y: 50 
  },
  // Кінцевий стан (видимий, на своїй позиції)
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.8,
      ease: [0.6, 0.01, -0.05, 0.95] // Плавний ease
    }
  }
};

const AnimatedSection = ({ children, className }: AnimatedSectionProps) => {
  return (
    <motion.section
      className={className} // Передаємо будь-які класи, які можуть знадобитися
      variants={sectionVariants}
      initial="hidden"       // Починаємо як "hidden"
      whileInView="visible"  // Анімуємо до "visible" коли елемент потрапляє в зону видимості
      viewport={{ once: true, amount: 0.25 }} // Анімація спрацює 1 раз, коли 25% секції видно
    >
      {children}
    </motion.section>
  );
};

export default AnimatedSection;