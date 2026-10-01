import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion"
import { TextLabel } from "@/components/ui/label"
import { boolToYesNo } from "@/lib/helpers"
import { CEDI } from "@/lib/constants"
import { formatPhoneNumberStartWithZero } from "@/modules/UserManagement/utils/helpers"
import { EDUCATION_LEVEL_OPTIONS, MARITAL_STATUS_OPTIONS, labelFor } from "../utils/constants"
import { NUMBER_OF_FARMS_API_KEY } from "../utils/helpers"

const show = (v: any) => (v === undefined || v === null || v === "" ? "-" : String(v))

/** Read-only "Project & Profile Details" accordion for the farmer view screens. */
export default function FarmerProfileInfo({ defaultData }: { defaultData: any }) {
  const project = defaultData?.project
  const projectName = typeof project === "object" ? project?.name : project

  return (
    <Accordion type="single" collapsible className="w-full">
      <AccordionItem value="item-profile">
        <AccordionTrigger className="border px-5 rounded-t-lg text-[#4A8D34]">
          Project & Profile Details
        </AccordionTrigger>
        <AccordionContent className="border p-5 border-t-0 rounded-b-lg">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            <TextLabel title="Project" subTitle={show(projectName)} variant="dark" />
            <TextLabel title="Nationality" subTitle={show(defaultData?.nationality)} variant="dark" />
            <TextLabel title="Marital Status" subTitle={show(labelFor(MARITAL_STATUS_OPTIONS, defaultData?.marital_status))} variant="dark" />
            <TextLabel title="Education Level" subTitle={show(labelFor(EDUCATION_LEVEL_OPTIONS, defaultData?.education_level))} variant="dark" />
            <TextLabel
              title="Alternative Phone Number"
              subTitle={defaultData?.alternative_phone_number ? formatPhoneNumberStartWithZero(defaultData.alternative_phone_number) : "-"}
              variant="dark"
            />
            <TextLabel title="Average Income" subTitle={defaultData?.average_income != null ? `${CEDI}${defaultData.average_income}` : "-"} variant="dark" />
            <TextLabel title="Years of Farming Experience" subTitle={show(defaultData?.years_of_experience)} variant="dark" />
            <TextLabel title="Number of Households" subTitle={show(defaultData?.number_of_households)} variant="dark" />
            <TextLabel title="Number of Dependents" subTitle={show(defaultData?.number_of_dependents)} variant="dark" />
            <TextLabel title="Number of Farms" subTitle={show(defaultData?.[NUMBER_OF_FARMS_API_KEY])} variant="dark" />
            <TextLabel title="Data Consent Given" subTitle={boolToYesNo(defaultData?.consent)} variant="dark" />
          </div>
        </AccordionContent>
      </AccordionItem>
    </Accordion>
  )
}
