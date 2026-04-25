'use client';

import { motion } from 'framer-motion';
import { GripVertical, X } from 'lucide-react';
import React, { useState, useEffect } from 'react';
import { Responsive, WidthProvider, Layout } from 'react-grid-layout';
import 'react-grid-layout/css/styles.css';
import 'react-resizable/css/styles.css';

const ResponsiveGridLayout = WidthProvider(Responsive);

export interface Widget {
  id: string;
  type: 'stats' | 'chart' | 'activity' | 'quick-actions';
  title: string;
  position: { x: number; y: number; w: number; h: number };
  config?: any;
}

interface DashboardGridProps {
  widgets: Widget[];
  onLayoutChange?: (layout: Layout[]) => void;
  onRemoveWidget?: (widgetId: string) => void;
}

export const DashboardGrid: React.FC<DashboardGridProps> = ({
  widgets,
  onLayoutChange,
  onRemoveWidget,
}) => {
  const [layout, setLayout] = useState<Layout[]>([]);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    const initialLayout = widgets.map((w) => ({
      i: w.id,
      x: w.position.x,
      y: w.position.y,
      w: w.position.w,
      h: w.position.h,
      static: false,
    }));
    setLayout(initialLayout);
  }, [widgets]);

  const handleLayoutChange = (newLayout: Layout[]) => {
    setLayout(newLayout);
    onLayoutChange?.(newLayout);
  };

  if (!mounted) return null;

  return (
    <ResponsiveGridLayout
      className="layout"
      layouts={{ lg: layout }}
      onLayoutChange={handleLayoutChange}
      breakpoints={{ lg: 1200, md: 996, sm: 768, xs: 480, xxs: 0 }}
      cols={{ lg: 12, md: 10, sm: 6, xs: 4, xxs: 2 }}
      rowHeight={60}
      width={1200}
      isDraggable
      isResizable
      compactType="vertical"
      preventCollision={false}
      useCSSTransforms
    >
      {widgets.map((widget) => (
        <motion.div
          key={widget.id}
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0.9 }}
          className="bg-white dark:bg-gray-900 rounded-lg shadow-lg overflow-hidden"
        >
          <WidgetRenderer widget={widget} onRemove={onRemoveWidget} />
        </motion.div>
      ))}
    </ResponsiveGridLayout>
  );
};

// Widget renderer
const WidgetRenderer: React.FC<{ widget: Widget; onRemove?: (id: string) => void }> = ({
  widget,
  onRemove,
}) => {
  const renderContent = () => {
    switch (widget.type) {
      case 'stats':
        return <StatsWidget config={widget.config} />;
      case 'chart':
        return <ChartWidget config={widget.config} />;
      case 'activity':
        return <ActivityWidget config={widget.config} />;
      case 'quick-actions':
        return <QuickActionsWidget config={widget.config} />;
      default:
        return null;
    }
  };

  return (
    <div className="h-full flex flex-col">
      <div className="widget-header flex items-center justify-between p-4 border-b dark:border-gray-700 cursor-move">
        <div className="flex items-center gap-2">
          <GripVertical size={16} className="text-gray-400" />
          <h3 className="font-semibold">{widget.title}</h3>
        </div>
        {onRemove && (
          <motion.button
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
            onClick={() => onRemove(widget.id)}
            className="p-1 hover:bg-gray-100 dark:hover:bg-gray-800 rounded"
          >
            <X size={16} />
          </motion.button>
        )}
      </div>
      <div className="flex-1 p-4 overflow-auto">{renderContent()}</div>
    </div>
  );
};

// Stats widget
const StatsWidget: React.FC<{ config?: any }> = ({ config }) => (
  <div className="space-y-3">
    <div className="flex justify-between items-center">
      <span className="text-gray-600 dark:text-gray-400">Total Contributions</span>
      <span className="text-2xl font-bold">1,234</span>
    </div>
    <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
      <motion.div
        initial={{ width: 0 }}
        animate={{ width: '75%' }}
        transition={{ duration: 1 }}
        className="bg-blue-500 h-2 rounded-full"
      />
    </div>
  </div>
);

// Chart widget
const ChartWidget: React.FC<{ config?: any }> = ({ config }) => (
  <div className="space-y-2">
    {[40, 60, 80, 50, 70].map((height, i) => (
      <motion.div
        key={i}
        initial={{ height: 0 }}
        animate={{ height: `${height}px` }}
        transition={{ duration: 0.5, delay: i * 0.1 }}
        className="bg-gradient-to-r from-blue-400 to-blue-600 rounded"
      />
    ))}
  </div>
);

// Activity widget
const ActivityWidget: React.FC<{ config?: any }> = ({ config }) => (
  <div className="space-y-2">
    {['John contributed $50', 'Jane joined the group', 'Payment distributed'].map((activity, i) => (
      <motion.div
        key={i}
        initial={{ opacity: 0, x: -20 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ delay: i * 0.1 }}
        className="flex items-center gap-2 p-2 bg-gray-50 dark:bg-gray-800 rounded"
      >
        <div className="w-2 h-2 bg-blue-500 rounded-full" />
        <span className="text-sm">{activity}</span>
      </motion.div>
    ))}
  </div>
);

// Quick actions widget
const QuickActionsWidget: React.FC<{ config?: any }> = ({ config }) => (
  <div className="grid grid-cols-2 gap-2">
    {['Contribute', 'View Details', 'Invite', 'Settings'].map((action) => (
      <motion.button
        key={action}
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        className="px-3 py-2 bg-blue-500 text-white rounded text-sm font-medium hover:bg-blue-600"
      >
        {action}
      </motion.button>
    ))}
  </div>
);

// Dashboard customization panel
export const DashboardCustomizer: React.FC<{
  availableWidgets: Widget[];
  onAddWidget?: (widget: Widget) => void;
}> = ({ availableWidgets, onAddWidget }) => (
  <motion.div
    initial={{ opacity: 0, x: 20 }}
    animate={{ opacity: 1, x: 0 }}
    className="bg-white dark:bg-gray-900 rounded-lg shadow-lg p-4"
  >
    <h3 className="font-semibold mb-4">Add Widgets</h3>
    <div className="space-y-2">
      {availableWidgets.map((widget) => (
        <motion.button
          key={widget.id}
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          onClick={() => onAddWidget?.(widget)}
          className="w-full p-3 text-left bg-gray-50 dark:bg-gray-800 hover:bg-gray-100 dark:hover:bg-gray-700 rounded transition-colors"
        >
          <p className="font-medium">{widget.title}</p>
          <p className="text-sm text-gray-600 dark:text-gray-400">Type: {widget.type}</p>
        </motion.button>
      ))}
    </div>
  </motion.div>
);
