"use client"

import { UseFormReturn } from "react-hook-form"
import PhoneNumberInput from "react-phone-number-input"
import {
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { Checkbox } from "@/components/ui/checkbox"
import { Label } from "@/components/ui/label"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { CEDI, YES_NO_OPTIONS } from "@/lib/constants"
import { ProjectCombobox } from "./ProjectCombobox"
import { NATIONALITY_OPTIONS } from "./nationalities"
import { EDUCATION_LEVEL_OPTIONS, MARITAL_STATUS_OPTIONS } from "./constants"

/**
 * Project picker (select an existing project or create one inline).
 * Rendered at the very top of the farmer registration forms.
 */
export function ProjectField({
  form,
  defaultData,
}: {
  form: UseFormReturn<any>
  defaultData?: any
}) {
  return (
    <FormField
      control={form.control}
      name="project"
      render={({ field }) => (
        <FormItem>
          <FormLabel>Project</FormLabel>
          <FormControl>
            <ProjectCombobox
              value={field.value}
              onChange={(value) => form.setValue("project", value, { shouldDirty: true })}
              selectedLabel={defaultData?.project?.name}
            />
          </FormControl>
          <p className="text-xs text-muted-foreground">
            Can&apos;t find it? Type the project name and choose &quot;Create project&quot;.
          </p>
          <FormMessage />
        </FormItem>
      )}
    />
  )
}

/**
 * "Is the farmer a refugee?" Yes / No. Shared by the lead farmer and the
 * smallholder / commercial farmer forms so all three types ask it identically.
 * Defaults to No (see getFarmerProfileDefaultValues), so it never blocks
 * submitting. The radio ids are unique per field: the other Yes/No questions
 * on these forms reuse the bare ids "true"/"false", which makes clicking a
 * label toggle the wrong group - don't copy that here.
 */
export function RefugeeField({ form }: { form: UseFormReturn<any> }) {
  return (
    <div>
      <Label className="capitalize mb-3">Is the farmer a refugee?</Label>
      <FormField
        control={form.control}
        name="is_refugee"
        render={({ field }) => (
          <FormItem>
            <RadioGroup
              className="flex flex-row w-full gap-x-6"
              onValueChange={field.onChange}
              value={field.value}
            >
              {YES_NO_OPTIONS.map((item) => (
                <div key={item.value} className="flex items-center space-x-2">
                  <RadioGroupItem value={item.value} id={`is_refugee-${item.value}`} />
                  <Label htmlFor={`is_refugee-${item.value}`} className="capitalize cursor-pointer">
                    {item.label}
                  </Label>
                </div>
              ))}
            </RadioGroup>
            <FormMessage />
          </FormItem>
        )}
      />
    </div>
  )
}

/**
 * The profile/socio-economic section shared by the Lead, Smallholder and
 * Commercial Farmer forms (the Project picker lives in <ProjectField/>). Field names match
 * `getFarmerProfileDefaultValues` / `buildFarmerProfilePayload` in ./helpers.
 */
export default function FarmerProfileFields({
  form,
}: {
  form: UseFormReturn<any>
}) {
  const numberField = (
    name: string,
    label: string,
    placeholder: string,
    extra?: { step?: string },
  ) => (
    <FormField
      control={form.control}
      name={name}
      render={({ field }) => (
        <FormItem>
          <FormLabel>{label}</FormLabel>
          <FormControl>
            <Input
              type="number"
              min={0}
              step={extra?.step}
              placeholder={placeholder}
              {...field}
              value={field.value ?? ""}
            />
          </FormControl>
          <FormMessage />
        </FormItem>
      )}
    />
  )

  return (
    <>
      <div className="text-xl font-medium">Profile Details</div>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        <FormField
          control={form.control}
          name="nationality"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Nationality</FormLabel>
              <Select onValueChange={field.onChange} value={field.value || ""}>
                <FormControl>
                  <SelectTrigger className="w-full">
                    <SelectValue placeholder="Select" />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  {NATIONALITY_OPTIONS.map((item) => (
                    <SelectItem key={item} value={item}>
                      {item}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="marital_status"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Marital Status</FormLabel>
              <Select onValueChange={field.onChange} value={field.value || ""}>
                <FormControl>
                  <SelectTrigger className="w-full">
                    <SelectValue placeholder="Select" />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  {MARITAL_STATUS_OPTIONS.map((item) => (
                    <SelectItem key={item.value} value={item.value}>
                      {item.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="education_level"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Education Level</FormLabel>
              <Select onValueChange={field.onChange} value={field.value || ""}>
                <FormControl>
                  <SelectTrigger className="w-full">
                    <SelectValue placeholder="Select" />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  {EDUCATION_LEVEL_OPTIONS.map((item) => (
                    <SelectItem key={item.value} value={item.value}>
                      {item.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="alternative_phone_number"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Alternative Phone Number</FormLabel>
              <FormControl>
                <PhoneNumberInput
                  {...field}
                  maxLength={12}
                  placeholder="eg. 024 123 4567"
                  defaultCountry="GH"
                  className="phone-input"
                  international={false}
                  countryCallingCodeEditable={true}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        {numberField("average_income", `Average Income (${CEDI})`, "e.g. 1500", { step: "0.01" })}
        {numberField("years_of_experience", "Years of Farming Experience", "e.g. 5")}
        {numberField("number_of_households", "Number of Households", "e.g. 1")}
        {numberField("number_of_dependents", "Number of Dependents", "e.g. 3")}
        {numberField("number_of_farms", "Number of Farms", "e.g. 2")}

        <FormField
          control={form.control}
          name="consent"
          render={({ field }) => (
            <FormItem className="md:col-span-2 flex flex-row items-center gap-3 rounded-md border p-4">
              <FormControl>
                <Checkbox
                  checked={!!field.value}
                  onCheckedChange={(checked) => field.onChange(checked === true)}
                />
              </FormControl>
              <FormLabel className="cursor-pointer font-normal">
                The farmer has given consent for their data to be collected and used.
              </FormLabel>
              <FormMessage />
            </FormItem>
          )}
        />
      </div>
    </>
  )
}
