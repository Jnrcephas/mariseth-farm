import { z } from "zod";

export const externalFarmSchema = z.object({
    name: z.string().min(2, {
    message: 'Farm name must be at least 2 characters.',
  }),
  farmer: z.string(),
  location: z.string().min(2, {
    message: 'Location must be at least 2 characters.',
  }),
  region: z.string(),
  district: z.string(),
  size: z.string(),
  land_ownership: z.enum(['owned', 'leased', 'communal', 'other', ''], {
    required_error: 'Please select an option.',
  }),
  size_metric: z.string(),
  other_land_ownership: z.string().min(2, {
    message: 'Other must be at least 2 characters.',
  }).optional(),
  crops: z.array(z.object({
    value: z.number(),
    label: z.string()
  })),
  livestock: z.array(z.object({
    value: z.number(),
    label: z.string()
  })).optional(),
  use_of_fertilizers: z.string(),
  farming_methods: z.string(),
  irrigation: z.string(),
  has_access_to_market: z.string(),
});

export const internalFarmSchema = z.object({
   name: z.string().min(2, {
    message: 'Farm name must be at least 2 characters.',
  }),
  type: z.string(),
  location: z.string().min(2, {
    message: 'Location must be at least 2 characters.',
  }),
  region: z.string(),
  district: z.string(),
  size: z.string(),
  size_metric: z.string(),
  crops: z.array(z.object({
    value: z.number(),
    label: z.string()
  })),
  livestock: z.array(z.object({
    value: z.number(),
    label: z.string()
  })).optional(),
});


export const leadFarmerSchema = z.object({
  
  first_name: z.string().min(2, {
    message: 'First name must be at least 2 characters.',
  }),
  last_name: z.string().min(2, {
    message: 'Last name must be at least 2 characters.',
  }),
  other_names: z.string().optional(),
  gender: z.string(),
  date_of_birth: z.string(),
  id_type: z.string(),
  id_number: z.string(),
  phone_number: z.string(),
  email: z.string().optional(),
  address: z.string(),
  village: z.string(),
  region: z.string(),
  district: z.string(),
  country: z.string(),
  farm: z.string().optional(),
  farming_type: z.string().optional(),
  is_mentoring_other_farmers: z.string().optional(),
  number_of_farmers_mentoring: z.string().optional(),
  has_farming_membership: z.string().optional(),
  farm_association: z.string().optional().optional(),
  has_received_farming_leadership_training: z.string().optional(),
  farming_leadership_training: z.string().optional(),
  has_received_support: z.string().optional(),
  support_received: z.string().optional(),
  areas_of_needed_assistance: z.string().optional(),
});

export const smallholderFarmerSchema = z.object({
  
  first_name: z.string().min(2, {
    message: 'First name must be at least 2 characters.',
  }),
  last_name: z.string().min(2, {
    message: 'Last name name must be at least 2 characters.',
  }),
  other_names: z.string().optional(),
  gender: z.string(),
  date_of_birth: z.string(),
  id_type: z.string().optional(),
  id_number: z.string().optional(),
  phone_number: z.string().optional(),
  email: z.string().optional(),
  address: z.string(),
  village: z.string(),
  region: z.string(),
  district: z.string(),
  country: z.string(),
  lead_farmer: z.string(),
  farm: z.string().optional(),
  has_received_support: z.string().optional(),
  support_received: z.string().optional(),
  areas_of_needed_assistance: z.string().optional(),
});

export const cropSchema = z.object({
  name: z.string().min(2, {
    message: 'Farm name must be at least 2 characters.',
  }),
  category: z.string(),
  description: z.string().optional(),
  color: z.string(),
  season_status: z.string(),
  season_start: z.string(),
  season_end: z.string(),
  weight: z.string().optional(),
  weight_metric: z.string().optional(),
});

export const productsSchema = z.object({
  name: z.string().min(2, {
    message: 'Farm name must be at least 2 characters.',
  }),
  category: z.string(),
  breed: z.string().optional(),
  color: z.string(),
  description: z.string().optional(),
  weight: z.string().optional(),
  weight_metric: z.string().optional(),
});

export const searchFarmSchema = z.object({
  query: z.string().optional(),
  crop_type: z.string().optional(),
  type: z.string().optional(),
  land_ownership: z.string().optional(),
  region: z.string().optional(),
  district: z.string().optional(),
});

export const searchFarmerSchema = z.object({
  query: z.string().optional(),
  region: z.string().optional(),
  district: z.string().optional(),
});

export const searchProductSchema = z.object({
  query: z.string().optional(),
  category: z.string().optional(),
  season_status: z.string().optional(),
});

export const reassignFarmerSchema = 
z.object({
  lead_farmer_id: z.string()
});