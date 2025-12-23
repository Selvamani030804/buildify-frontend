import React, { Children, cloneElement, useEffect, useRef, useState } from 'react';
import { motion, useMotionValue, useSpring, useTransform, AnimatePresence, MotionValue } from 'framer-motion';

// Types for props
interface DockItemProps {
  children: React.ReactNode;
  className?: string;
  onClick?: () => void;
  mouseX: MotionValue<number>;
  mouseY: MotionValue<number>;
  spring: any;
  distance: number;
  magnification: number;
  baseItemSize: number;
  isActive?: boolean;
  orientation: 'horizontal' | 'vertical';
}

const DockItem: React.FC<DockItemProps> = ({ 
  children, 
  className = '', 
  onClick, 
  mouseX,
  mouseY,
  spring, 
  distance, 
  magnification, 
  baseItemSize,
  isActive,
  orientation
}) => {
  const ref = useRef<HTMLDivElement>(null);
  const isHovered = useMotionValue(0);

  const mouseDistance = useTransform(orientation === 'vertical' ? mouseY : mouseX, (val: number) => {
    const rect = ref.current?.getBoundingClientRect() ?? {
      x: 0,
      y: 0,
      width: baseItemSize,
      height: baseItemSize
    };
    
    // Calculate distance based on center of item
    if (orientation === 'vertical') {
        return val - rect.y - baseItemSize / 2;
    }
    return val - rect.x - baseItemSize / 2;
  });

  const targetSize = useTransform(mouseDistance, [-distance, 0, distance], [baseItemSize, magnification, baseItemSize]);
  const size = useSpring(targetSize, spring);

  return (
    <motion.div
      ref={ref}
      style={{
        width: size,
        height: size,
        minWidth: size, // Critical for vertical flow
        minHeight: size
      }}
      onHoverStart={() => isHovered.set(1)}
      onHoverEnd={() => isHovered.set(0)}
      onFocus={() => isHovered.set(1)}
      onBlur={() => isHovered.set(0)}
      onClick={onClick}
      className={`dock-item ${isActive ? 'active' : ''} ${className}`}
      tabIndex={0}
      role="button"
      aria-haspopup="true"
    >
      {Children.map(children, child => {
         if (React.isValidElement(child)) {
           return cloneElement(child, { isHovered, orientation } as any);
         }
         return child;
      })}
    </motion.div>
  );
};

function DockLabel({ children, className = '', ...rest }: any) {
  const { isHovered, orientation } = rest;
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    if (isHovered) {
      const unsubscribe = isHovered.on('change', (latest: number) => {
        setIsVisible(latest === 1);
      });
      return () => unsubscribe();
    }
  }, [isHovered]);

  const variants = {
      vertical: {
          initial: { opacity: 0, x: 20, y: "-50%" },
          animate: { opacity: 1, x: 0, y: "-50%" },
          exit: { opacity: 0, x: 10, y: "-50%" }
      },
      horizontal: {
          initial: { opacity: 0, y: -20, x: "-50%" },
          animate: { opacity: 1, y: 0, x: "-50%" },
          exit: { opacity: 0, y: -10, x: "-50%" }
      }
  };

  const style = orientation === 'vertical' 
    ? { left: '100%', top: '50%', marginLeft: '12px' } 
    : { top: '-3rem', left: '50%' };

  return (
    <AnimatePresence>
      {isVisible && (
        <motion.div
          variants={orientation === 'vertical' ? variants.vertical : variants.horizontal}
          initial="initial"
          animate="animate"
          exit="exit"
          transition={{ duration: 0.2 }}
          className={`dock-label ${className}`}
          role="tooltip"
          style={style}
        >
          {children}
        </motion.div>
      )}
    </AnimatePresence>
  );
}

function DockIcon({ children, className = '', ...rest }: { children?: React.ReactNode, className?: string, [key: string]: any }) {
  return <div className={`dock-icon ${className}`}>{children}</div>;
}

interface DockProps {
  items: Array<{
    icon: React.ReactNode;
    label: string;
    onClick: () => void;
    className?: string;
    id?: string;
  }>;
  className?: string;
  spring?: any;
  magnification?: number;
  distance?: number;
  baseItemSize?: number;
  activeId?: string;
  orientation?: 'horizontal' | 'vertical';
}

export default function Dock({
  items,
  className = '',
  spring = { mass: 0.1, stiffness: 150, damping: 12 },
  magnification = 80,
  distance = 200,
  baseItemSize = 50,
  activeId,
  orientation = 'horizontal'
}: DockProps) {
  const mouseX = useMotionValue(Infinity);
  const mouseY = useMotionValue(Infinity);
  const isHovered = useMotionValue(0);

  return (
    <div className={`dock-outer fixed z-50 ${orientation === 'vertical' ? 'left-4 top-1/2 -translate-y-1/2' : 'bottom-6 left-1/2 -translate-x-1/2'}`}>
      <motion.div
        onMouseMove={(e) => {
          isHovered.set(1);
          mouseX.set(e.pageX);
          mouseY.set(e.pageY);
        }}
        onMouseLeave={() => {
          isHovered.set(0);
          mouseX.set(Infinity);
          mouseY.set(Infinity);
        }}
        className={`dock-panel ${className}`}
        style={{ 
            flexDirection: orientation === 'vertical' ? 'column' : 'row',
            width: orientation === 'vertical' ? 'fit-content' : 'auto',
            height: 'auto'
        }}
        role="toolbar"
        aria-label="Application dock"
      >
        {items.map((item, index) => (
          <DockItem
            key={index}
            onClick={item.onClick}
            className={item.className}
            mouseX={mouseX}
            mouseY={mouseY}
            spring={spring}
            distance={distance}
            magnification={magnification}
            baseItemSize={baseItemSize}
            isActive={activeId === item.id}
            orientation={orientation}
          >
            <DockIcon>{item.icon}</DockIcon>
            <DockLabel>{item.label}</DockLabel>
          </DockItem>
        ))}
      </motion.div>
    </div>
  );
}