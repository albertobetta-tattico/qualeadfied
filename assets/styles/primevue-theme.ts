/**
 * QUALEADFIED - PrimeVue 4 Theme Preset
 * Based on Aura theme with custom design tokens
 * Version 1.0 - January 2026
 */

import { definePreset } from '@primevue/themes'
import Aura from '@primevue/themes/aura'

const QualeadfiedPreset = definePreset(Aura, {
  // ============================================
  // SEMANTIC TOKENS
  // ============================================
  semantic: {
    // Primary Color
    primary: {
      50: '{slate.50}',
      100: '{slate.100}',
      200: '{slate.200}',
      300: '{slate.300}',
      400: '{slate.400}',
      500: '{slate.500}',
      600: '{slate.600}',
      700: '{slate.700}',
      800: '{slate.800}',
      900: '{slate.900}',
      950: '{slate.950}'
    },

    // Color Scheme Light
    colorScheme: {
      light: {
        // Primary
        primary: {
          color: '#0F3460',
          inverseColor: '#ffffff',
          hoverColor: '#16213E',
          activeColor: '#1A1A2E'
        },

        // Surface colors
        surface: {
          0: '#ffffff',
          50: '#F8F9FA',
          100: '#F1F3F5',
          200: '#E9ECEF',
          300: '#DEE2E6',
          400: '#CED4DA',
          500: '#ADB5BD',
          600: '#6C757D',
          700: '#495057',
          800: '#343A40',
          900: '#212529',
          950: '#1A1A2E'
        },

        // Content colors
        text: {
          color: '{surface.800}',
          hoverColor: '{surface.900}',
          mutedColor: '{surface.600}',
          hoverMutedColor: '{surface.700}'
        },

        // Highlight
        highlight: {
          background: 'rgba(15, 52, 96, 0.1)',
          focusBackground: 'rgba(15, 52, 96, 0.2)',
          color: '#0F3460',
          focusColor: '#0F3460'
        },

        // Mask/Overlay
        mask: {
          background: 'rgba(0, 0, 0, 0.4)',
          color: '{surface.200}'
        },

        // Form fields
        formField: {
          background: '{surface.0}',
          disabledBackground: '{surface.100}',
          filledBackground: '{surface.50}',
          filledHoverBackground: '{surface.50}',
          filledFocusBackground: '{surface.50}',
          borderColor: '{surface.200}',
          hoverBorderColor: '{surface.400}',
          focusBorderColor: '{primary.color}',
          invalidBorderColor: '#DC3545',
          color: '{surface.800}',
          disabledColor: '{surface.500}',
          placeholderColor: '{surface.500}',
          floatLabelColor: '{surface.600}',
          floatLabelFocusColor: '{primary.color}',
          floatLabelActiveColor: '{surface.600}',
          floatLabelInvalidColor: '#DC3545',
          iconColor: '{surface.500}',
          shadow: 'none'
        }
      },

      // Dark Mode (optional - for future use)
      dark: {
        primary: {
          color: '#5C9FE7',
          inverseColor: '#1A1A2E',
          hoverColor: '#7AB5F0',
          activeColor: '#98CBF9'
        },

        surface: {
          0: '#1A1A2E',
          50: '#212136',
          100: '#2A2A42',
          200: '#33334E',
          300: '#3D3D5A',
          400: '#474766',
          500: '#6C6C8A',
          600: '#9090A8',
          700: '#B4B4C6',
          800: '#D8D8E4',
          900: '#ECECF2',
          950: '#F8F8FC'
        },

        text: {
          color: '{surface.800}',
          hoverColor: '{surface.900}',
          mutedColor: '{surface.600}',
          hoverMutedColor: '{surface.700}'
        }
      }
    }
  },

  // ============================================
  // COMPONENT TOKENS
  // ============================================
  components: {
    // Button
    button: {
      root: {
        borderRadius: '6px',
        paddingX: '1rem',
        paddingY: '0.625rem',
        gap: '0.5rem',
        fontWeight: '500',
        transitionDuration: '0.2s'
      },
      colorScheme: {
        light: {
          root: {
            primary: {
              background: '#0F3460',
              hoverBackground: '#16213E',
              activeBackground: '#1A1A2E',
              borderColor: '#0F3460',
              hoverBorderColor: '#16213E',
              activeBorderColor: '#1A1A2E',
              color: '#ffffff',
              hoverColor: '#ffffff',
              activeColor: '#ffffff',
              focusRing: {
                color: 'rgba(15, 52, 96, 0.2)',
                shadow: '0 0 0 3px rgba(15, 52, 96, 0.15)'
              }
            },
            secondary: {
              background: '{surface.600}',
              hoverBackground: '{surface.700}',
              activeBackground: '{surface.800}',
              borderColor: '{surface.600}',
              hoverBorderColor: '{surface.700}',
              activeBorderColor: '{surface.800}',
              color: '#ffffff',
              hoverColor: '#ffffff',
              activeColor: '#ffffff'
            },
            success: {
              background: '#28A745',
              hoverBackground: '#218838',
              activeBackground: '#1E7E34',
              color: '#ffffff'
            },
            info: {
              background: '#17A2B8',
              hoverBackground: '#138496',
              activeBackground: '#117A8B',
              color: '#ffffff'
            },
            warn: {
              background: '#FFC107',
              hoverBackground: '#E0A800',
              activeBackground: '#D39E00',
              color: '#212529'
            },
            danger: {
              background: '#DC3545',
              hoverBackground: '#C82333',
              activeBackground: '#BD2130',
              color: '#ffffff'
            },
            contrast: {
              background: '#1A1A2E',
              hoverBackground: '#0E0E1A',
              color: '#ffffff'
            }
          }
        }
      }
    },

    // Card
    card: {
      root: {
        background: '#ffffff',
        borderRadius: '8px',
        color: '{surface.800}',
        shadow: '0 1px 3px rgba(0, 0, 0, 0.08)'
      },
      body: {
        padding: '1.5rem',
        gap: '0.75rem'
      },
      title: {
        fontWeight: '600',
        fontSize: '1.125rem'
      },
      subtitle: {
        color: '{surface.600}'
      }
    },

    // DataTable
    datatable: {
      root: {
        transitionDuration: '0.2s'
      },
      header: {
        background: '{surface.50}',
        borderColor: '{surface.200}',
        color: '{surface.800}',
        padding: '1rem'
      },
      headerCell: {
        background: '{surface.50}',
        hoverBackground: '{surface.100}',
        borderColor: '{surface.200}',
        color: '{surface.700}',
        padding: '0.75rem 1rem',
        gap: '0.5rem',
        fontWeight: '600'
      },
      bodyCell: {
        borderColor: '{surface.200}',
        padding: '0.75rem 1rem'
      },
      row: {
        background: '{surface.0}',
        hoverBackground: '{surface.50}',
        selectedBackground: 'rgba(15, 52, 96, 0.08)',
        selectedHoverBackground: 'rgba(15, 52, 96, 0.12)',
        color: '{surface.800}',
        selectedColor: '#0F3460'
      },
      footer: {
        background: '{surface.50}',
        borderColor: '{surface.200}',
        color: '{surface.800}',
        padding: '1rem'
      },
      paginatorTop: {
        borderColor: '{surface.200}'
      },
      paginatorBottom: {
        borderColor: '{surface.200}'
      }
    },

    // Input Text
    inputtext: {
      root: {
        background: '{surface.0}',
        borderColor: '{surface.200}',
        hoverBorderColor: '{surface.400}',
        focusBorderColor: '#0F3460',
        invalidBorderColor: '#DC3545',
        color: '{surface.800}',
        placeholderColor: '{surface.500}',
        borderRadius: '6px',
        padding: '0.75rem 1rem',
        transitionDuration: '0.2s'
      }
    },

    // Select / Dropdown
    select: {
      root: {
        background: '{surface.0}',
        borderColor: '{surface.200}',
        hoverBorderColor: '{surface.400}',
        focusBorderColor: '#0F3460',
        borderRadius: '6px',
        transitionDuration: '0.2s'
      },
      dropdown: {
        borderRadius: '6px'
      },
      option: {
        selectedBackground: 'rgba(15, 52, 96, 0.08)',
        selectedFocusBackground: 'rgba(15, 52, 96, 0.12)',
        selectedColor: '#0F3460'
      }
    },

    // Dialog / Modal
    dialog: {
      root: {
        background: '{surface.0}',
        borderColor: '{surface.200}',
        color: '{surface.800}',
        borderRadius: '12px',
        shadow: '0 16px 48px rgba(0, 0, 0, 0.2)'
      },
      header: {
        padding: '1.5rem',
        gap: '0.5rem'
      },
      title: {
        fontWeight: '600',
        fontSize: '1.25rem'
      },
      content: {
        padding: '0 1.5rem 1.5rem 1.5rem'
      },
      footer: {
        padding: '1.5rem',
        gap: '0.75rem'
      }
    },

    // Toast
    toast: {
      root: {
        background: '{surface.0}',
        borderRadius: '8px',
        shadow: '0 4px 16px rgba(0, 0, 0, 0.12)'
      },
      colorScheme: {
        light: {
          success: {
            background: '#F0FDF4',
            borderColor: '#22C55E',
            color: '#15803D',
            detailColor: '#166534',
            shadow: 'none'
          },
          info: {
            background: '#EFF6FF',
            borderColor: '#3B82F6',
            color: '#1E40AF',
            detailColor: '#1E3A8A',
            shadow: 'none'
          },
          warn: {
            background: '#FFFBEB',
            borderColor: '#F59E0B',
            color: '#B45309',
            detailColor: '#92400E',
            shadow: 'none'
          },
          error: {
            background: '#FEF2F2',
            borderColor: '#EF4444',
            color: '#B91C1C',
            detailColor: '#991B1B',
            shadow: 'none'
          }
        }
      }
    },

    // Tag / Badge
    tag: {
      root: {
        borderRadius: '9999px',
        padding: '0.25rem 0.75rem',
        gap: '0.25rem',
        fontWeight: '500',
        fontSize: '0.75rem'
      },
      colorScheme: {
        light: {
          primary: {
            background: 'rgba(15, 52, 96, 0.1)',
            color: '#0F3460'
          },
          success: {
            background: '#E8F5E9',
            color: '#2E7D32'
          },
          info: {
            background: '#E3F2FD',
            color: '#1565C0'
          },
          warn: {
            background: '#FFF3E0',
            color: '#E65100'
          },
          danger: {
            background: '#FFEBEE',
            color: '#C62828'
          }
        }
      }
    },

    // Menu / Sidebar
    menu: {
      root: {
        background: '{surface.0}',
        borderColor: '{surface.200}',
        borderRadius: '8px',
        shadow: '0 4px 16px rgba(0, 0, 0, 0.12)'
      },
      list: {
        padding: '0.5rem',
        gap: '0.25rem'
      },
      item: {
        padding: '0.75rem 1rem',
        borderRadius: '6px',
        gap: '0.5rem',
        focusBackground: '{surface.100}',
        activeBackground: 'rgba(15, 52, 96, 0.08)',
        color: '{surface.800}',
        focusColor: '{surface.900}',
        activeColor: '#0F3460'
      },
      itemIcon: {
        color: '{surface.500}',
        focusColor: '{surface.600}',
        activeColor: '#0F3460'
      }
    },

    // Sidebar (PanelMenu)
    panelmenu: {
      root: {
        gap: '0.25rem'
      },
      panel: {
        padding: '0.25rem'
      },
      header: {
        padding: '0.75rem 1rem',
        borderRadius: '6px',
        color: '{surface.800}',
        hoverBackground: '{surface.100}',
        hoverColor: '{surface.900}'
      },
      submenuHeader: {
        padding: '0.75rem 1rem',
        borderRadius: '6px',
        color: '{surface.600}',
        fontWeight: '500'
      },
      item: {
        padding: '0.75rem 1rem 0.75rem 2rem',
        borderRadius: '6px',
        color: '{surface.700}',
        focusBackground: '{surface.100}',
        activeBackground: 'rgba(15, 52, 96, 0.08)',
        focusColor: '{surface.800}',
        activeColor: '#0F3460'
      }
    },

    // Tabs
    tabs: {
      tabList: {
        borderColor: '{surface.200}'
      },
      tab: {
        background: 'transparent',
        hoverBackground: 'transparent',
        activeBackground: 'transparent',
        borderColor: 'transparent',
        hoverBorderColor: '{surface.300}',
        activeBorderColor: '#0F3460',
        color: '{surface.600}',
        hoverColor: '{surface.800}',
        activeColor: '#0F3460',
        padding: '1rem 1.25rem',
        fontWeight: '500'
      }
    },

    // Breadcrumb
    breadcrumb: {
      root: {
        padding: '1rem',
        background: 'transparent'
      },
      item: {
        color: '{surface.600}',
        hoverColor: '#0F3460',
        gap: '0.5rem'
      },
      separator: {
        color: '{surface.400}'
      }
    },

    // Paginator
    paginator: {
      root: {
        padding: '0.75rem',
        gap: '0.25rem',
        borderRadius: '8px',
        background: 'transparent'
      },
      navButton: {
        background: 'transparent',
        hoverBackground: '{surface.100}',
        selectedBackground: '#0F3460',
        color: '{surface.700}',
        hoverColor: '{surface.900}',
        selectedColor: '#ffffff',
        width: '2.5rem',
        height: '2.5rem',
        borderRadius: '6px'
      }
    },

    // Tooltip
    tooltip: {
      root: {
        background: '#1A1A2E',
        color: '#ffffff',
        padding: '0.5rem 0.75rem',
        borderRadius: '6px',
        shadow: '0 4px 12px rgba(0, 0, 0, 0.2)'
      }
    },

    // Checkbox
    checkbox: {
      root: {
        borderRadius: '4px',
        width: '1.25rem',
        height: '1.25rem',
        borderColor: '{surface.300}',
        hoverBorderColor: '{surface.400}',
        focusBorderColor: '#0F3460',
        checkedBackground: '#0F3460',
        checkedBorderColor: '#0F3460',
        checkedHoverBackground: '#16213E',
        invalidBorderColor: '#DC3545'
      },
      icon: {
        size: '0.75rem',
        color: '#ffffff',
        checkedColor: '#ffffff',
        checkedHoverColor: '#ffffff'
      }
    },

    // RadioButton
    radiobutton: {
      root: {
        width: '1.25rem',
        height: '1.25rem',
        borderColor: '{surface.300}',
        hoverBorderColor: '{surface.400}',
        focusBorderColor: '#0F3460',
        checkedBackground: '#0F3460',
        checkedBorderColor: '#0F3460',
        checkedHoverBackground: '#16213E',
        invalidBorderColor: '#DC3545'
      }
    },

    // InputSwitch / Toggle
    toggleswitch: {
      root: {
        width: '2.75rem',
        height: '1.5rem',
        borderRadius: '9999px',
        background: '{surface.300}',
        hoverBackground: '{surface.400}',
        checkedBackground: '#0F3460',
        checkedHoverBackground: '#16213E',
        invalidBorderColor: '#DC3545'
      },
      handle: {
        borderRadius: '50%',
        size: '1rem',
        background: '#ffffff'
      }
    },

    // Progress Bar
    progressbar: {
      root: {
        background: '{surface.200}',
        borderRadius: '9999px',
        height: '0.5rem'
      },
      value: {
        background: '#0F3460'
      },
      label: {
        color: '#ffffff',
        fontWeight: '600'
      }
    },

    // Badge
    badge: {
      root: {
        borderRadius: '9999px',
        padding: '0 0.5rem',
        minWidth: '1.25rem',
        height: '1.25rem',
        fontWeight: '600',
        fontSize: '0.75rem'
      },
      colorScheme: {
        light: {
          primary: {
            background: '#0F3460',
            color: '#ffffff'
          },
          success: {
            background: '#28A745',
            color: '#ffffff'
          },
          info: {
            background: '#17A2B8',
            color: '#ffffff'
          },
          warn: {
            background: '#FFC107',
            color: '#212529'
          },
          danger: {
            background: '#DC3545',
            color: '#ffffff'
          }
        }
      }
    },

    // Avatar
    avatar: {
      root: {
        borderRadius: '9999px',
        background: '{surface.200}',
        color: '{surface.700}'
      }
    },

    // Chip
    chip: {
      root: {
        borderRadius: '9999px',
        padding: '0.25rem 0.75rem',
        gap: '0.5rem',
        background: '{surface.100}',
        color: '{surface.800}'
      }
    },

    // Message
    message: {
      root: {
        borderRadius: '8px',
        borderWidth: '1px',
        borderStyle: 'solid'
      },
      colorScheme: {
        light: {
          success: {
            background: '#E8F5E9',
            borderColor: '#A5D6A7',
            color: '#2E7D32'
          },
          info: {
            background: '#E3F2FD',
            borderColor: '#90CAF9',
            color: '#1565C0'
          },
          warn: {
            background: '#FFF3E0',
            borderColor: '#FFCC80',
            color: '#E65100'
          },
          error: {
            background: '#FFEBEE',
            borderColor: '#EF9A9A',
            color: '#C62828'
          }
        }
      }
    },

    // Skeleton
    skeleton: {
      root: {
        borderRadius: '6px',
        background: '{surface.200}'
      }
    }
  }
})

export default QualeadfiedPreset
