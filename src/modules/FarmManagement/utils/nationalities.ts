/**
 * Nationality (demonym) options for the farmer "Nationality" dropdown.
 *
 * The backend stores nationality as free text (it was `null` in the sample
 * payload), so the demonym itself is what gets saved, e.g. "Ghanaian".
 * Ghana's neighbours are listed first since they're the most common choices
 * for this platform; the rest follow alphabetically.
 */
const PRIORITY = [
  "Ghanaian",
  "Ivorian",
  "Togolese",
  "Burkinabe",
  "Nigerian",
];

const OTHERS = [
  "Afghan", "Albanian", "Algerian", "American", "Andorran", "Angolan", "Argentine",
  "Armenian", "Australian", "Austrian", "Azerbaijani", "Bahamian", "Bahraini",
  "Bangladeshi", "Barbadian", "Belarusian", "Belgian", "Belizean", "Beninese",
  "Bhutanese", "Bolivian", "Bosnian", "Botswanan", "Brazilian", "British", "Bruneian",
  "Bulgarian", "Burundian", "Cambodian", "Cameroonian", "Canadian", "Cape Verdean",
  "Central African", "Chadian", "Chilean", "Chinese", "Colombian", "Comorian",
  "Congolese", "Costa Rican", "Croatian", "Cuban", "Cypriot", "Czech", "Danish",
  "Djiboutian", "Dominican", "Dutch", "Ecuadorean", "Egyptian", "Emirati",
  "Equatorial Guinean", "Eritrean", "Estonian", "Eswatini", "Ethiopian", "Fijian",
  "Filipino", "Finnish", "French", "Gabonese", "Gambian", "Georgian", "German",
  "Greek", "Grenadian", "Guatemalan", "Guinean", "Guinea-Bissauan", "Guyanese",
  "Haitian", "Honduran", "Hungarian", "Icelandic", "Indian", "Indonesian", "Iranian",
  "Iraqi", "Irish", "Israeli", "Italian", "Jamaican", "Japanese", "Jordanian",
  "Kazakh", "Kenyan", "Kuwaiti", "Kyrgyz", "Laotian", "Latvian", "Lebanese",
  "Basotho", "Liberian", "Libyan", "Lithuanian", "Luxembourgish", "Malagasy",
  "Malawian", "Malaysian", "Maldivian", "Malian", "Maltese", "Mauritanian",
  "Mauritian", "Mexican", "Moldovan", "Mongolian", "Montenegrin", "Moroccan",
  "Mozambican", "Namibian", "Nepalese", "New Zealander", "Nicaraguan", "Nigerien",
  "North Korean", "Norwegian", "Omani", "Pakistani", "Palestinian", "Panamanian",
  "Papua New Guinean", "Paraguayan", "Peruvian", "Polish", "Portuguese", "Qatari",
  "Romanian", "Russian", "Rwandan", "Saudi", "Senegalese", "Serbian", "Seychellois",
  "Sierra Leonean", "Singaporean", "Slovak", "Slovenian", "Somali", "South African",
  "South Korean", "South Sudanese", "Spanish", "Sri Lankan", "Sudanese", "Surinamese",
  "Swedish", "Swiss", "Syrian", "Taiwanese", "Tajik", "Tanzanian", "Thai",
  "Trinidadian", "Tunisian", "Turkish", "Turkmen", "Ugandan", "Ukrainian", "Uruguayan",
  "Uzbek", "Venezuelan", "Vietnamese", "Yemeni", "Zambian", "Zimbabwean",
];

export const NATIONALITY_OPTIONS: string[] = [
  ...PRIORITY,
  ...OTHERS.filter((n) => !PRIORITY.includes(n)).sort((a, b) => a.localeCompare(b)),
];
