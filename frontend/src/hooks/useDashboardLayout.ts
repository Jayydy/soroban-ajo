import { useState, useCallback, useEffect } from 'react';
import { Layout } from 'react-grid-layout';

export interface Widget {
  id: string;
  type: 'stats' | 'chart' | 'activity' | 'quick-actions';
  title: string;
  position: { x: number; y: number; w: number; h: number };
  config?: any;
}

export const useDashboard = (groupId: string) => {
  const [widgets, setWidgets] = useState<Widget[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Load dashboard layout from localStorage or API
    const loadDashboard = async () => {
      try {
        const saved = localStorage.getItem(`dashboard-${groupId}`);
        if (saved) {
          setWidgets(JSON.parse(saved));
        } else {
          // Load default widgets
          setWidgets(getDefaultWidgets());
        }
        setLoading(false);
      } catch (error) {
        console.error('Failed to load dashboard:', error);
        setWidgets(getDefaultWidgets());
        setLoading(false);
      }
    };

    loadDashboard();
  }, [groupId]);

  const getDefaultWidgets = (): Widget[] => [
    {
      id: 'stats-1',
      type: 'stats',
      title: 'Total Contributions',
      position: { x: 0, y: 0, w: 4, h: 3 },
    },
    {
      id: 'chart-1',
      type: 'chart',
      title: 'Contribution Trend',
      position: { x: 4, y: 0, w: 8, h: 3 },
    },
    {
      id: 'activity-1',
      type: 'activity',
      title: 'Recent Activity',
      position: { x: 0, y: 3, w: 6, h: 4 },
    },
    {
      id: 'quick-actions-1',
      type: 'quick-actions',
      title: 'Quick Actions',
      position: { x: 6, y: 3, w: 6, h: 4 },
    },
  ];

  const addWidget = useCallback(
    (widget: Widget) => {
      const newWidgets = [...widgets, widget];
      setWidgets(newWidgets);
      saveDashboard(newWidgets);
    },
    [widgets]
  );

  const removeWidget = useCallback(
    (widgetId: string) => {
      const newWidgets = widgets.filter((w) => w.id !== widgetId);
      setWidgets(newWidgets);
      saveDashboard(newWidgets);
    },
    [widgets]
  );

  const updateLayout = useCallback(
    (layout: Layout[]) => {
      const updatedWidgets = widgets.map((widget) => {
        const layoutItem = layout.find((l) => l.i === widget.id);
        if (layoutItem) {
          return {
            ...widget,
            position: {
              x: layoutItem.x,
              y: layoutItem.y,
              w: layoutItem.w,
              h: layoutItem.h,
            },
          };
        }
        return widget;
      });
      setWidgets(updatedWidgets);
      saveDashboard(updatedWidgets);
    },
    [widgets]
  );

  const saveDashboard = (dashboardWidgets: Widget[]) => {
    localStorage.setItem(`dashboard-${groupId}`, JSON.stringify(dashboardWidgets));
  };

  const resetLayout = useCallback(() => {
    const defaults = getDefaultWidgets();
    setWidgets(defaults);
    saveDashboard(defaults);
  }, []);

  return {
    widgets,
    loading,
    addWidget,
    removeWidget,
    updateLayout,
    resetLayout,
  };
};
