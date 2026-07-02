import { IPagination } from "@/components/CustomTable"
import { StylesConfig } from 'react-select';
import chroma from 'chroma-js';

export const statusBadgeMap = {
  denied: "danger",
  out: "danger",
  overdue: "danger",
  dismissal: "danger",
  declined: "danger",
  absent: "danger",
  
  other: "dark",
  suspension: "dark",

  delivery: "alt",
  
  
  availability_check: "warning",
  communal: "warning",
  delivery_inspection: "warning",
  inactive: "warning",
  partial_payment: "warning",
  pending: "warning",
  pending_verification: "warning",
  rented: "warning",
  warning: "warning",
  upcoming: "warning",
  

  approved: "success",
  active: "success",
  in: "success",
  owned: "success",
  paid: "success",
  verified: "success",
  order_picked_up: "success",
  completed: "success",
  present: "success",
  fulfilled: "success",

  leased: "info",
  order_approval: "info",
  order_approved: "info",
  truck_pickup: "info",
  partial: "info",
  order_pickup: "info",
  ongoing: "info"

} as any


export const samplePagination = {
    page: 1,
    pages: 1,
    has_next: false,
    has_previous: false,
    total: 7
} as IPagination

export const landOwnershipTypes = [
    "owned",
    "leased",
    "communal",
    "other"
]

export const fertilizerTypes = [
    "Organic",
    "Chemical",
    "None",
]

export const farmingMethods = [
    "Organic",
    "Conventional",
    "Mixed",
]

export const yesOrNoTypes = [
    "yes",
    "no",
]

export const ID_TYPE_OPTIONS = [
  "Ghana Card",
  "NHIS",
  "Driver's License",
  "Voter's Card",
  "Passport ID",
  "No ID",
]

export const seasonStatus = [
  {label: "In Season", value: "in"},
  {label: "Out Season", value: "out"}
]

export const sampleCropsGrown = [
    { value: 'soya-beans', label: 'Soya Beans', color: '#F97316' },
    { value: 'cocoa', label: 'Cocoa', color: '#3B82F6' },
    { value: 'oil-palm', label: 'Oil Palm', color: '#EF4444' },
    { value: 'maize', label: 'Maize', color: '#22C55E' },
    { value: 'rice', label: 'Rice', color: '#A855F7' },
    { value: 'cassava', label: 'Cassava', color: '#EC4899' }
];

export const cropsCategories = [
    { value: 'legumes', label: 'Legumes', color: '#F97316' },
    { value: 'tubers', label: 'Tubers', color: '#3B82F6' },
    { value: 'cereals', label: 'Cereals', color: '#EF4444' },
    { value: 'fruits', label: 'Fruits', color: '#22C55E' },
    { value: 'vegetables', label: 'Vegetables', color: '#A855F7' },
    { value: 'oilseeds', label: 'Oilseeds', color: '#EC4899' }
];

export const areasOfNeed = [
  {value: "seeds", label: "Seeds"},
  {value: "training", label: "Training"},
  {value: "equipment", label: "Equipment"},
  {value: "loans", label: "Loans"},
  {value: "market_access", label: "Market Access"},
  {value: "other", label: "Other"}
]


  export const selectColorStyles: StylesConfig<any, true> = {
    control: (styles) => ({ ...styles, backgroundColor: 'white' }),
    option: (styles, { data, isDisabled, isFocused, isSelected }) => {
      const color = chroma("#16A34A");
      return {
        ...styles,
        backgroundColor: isDisabled
          ? undefined
          : isSelected
          ? data.color
          : isFocused
          ? color.alpha(0.1).css()
          : undefined,
        color: isDisabled
          ? '#ccc'
          : isSelected
          ? chroma.contrast(color, 'white') > 2
            ? 'white'
            : 'black'
          :"#334155",
        cursor: isDisabled ? 'not-allowed' : 'default',
  
        ':active': {
          ...styles[':active'],
          backgroundColor: !isDisabled
            ? isSelected
              ? data.color
              : color.alpha(0.3).css()
            : undefined,
        },
      };
    },
    multiValue: (styles, { data }) => {
      const color = chroma(data.color);
      return {
        ...styles,
        backgroundColor: color.alpha(0.1).css(),
      };
    },
    multiValueLabel: (styles, { data }) => ({
      ...styles,
      color: data.color,
    }),
    multiValueRemove: (styles, { data }) => ({
      ...styles,
      color: data.color,
      ':hover': {
        backgroundColor: data.color,
        color: 'white',
      },
    }),
  };
