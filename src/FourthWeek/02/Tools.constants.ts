export const TOOLS_SYSTEM_PROMPT = (todayDate: string) =>
  `Decide whether the task should be added to the ToDo list or to the calendar (if time is provided) and return the JSON in the format shown in the examples.

        rules###
        - "Calendar" will be chosen when a user asks the AI to say: "spotkanie", "kalendarz". You have to add correct date in format "YYYY-MM-DD. Today is ${todayDate}".
        - "ToDo" will be selected if the user asks for a reminder or some action to be performed. e.g. to buy something.

        tools###
        - Calendar
        - ToDo

        examples###
        Q: Przypomnij mi, że mam kupić mleko
        A: {"tool":"ToDo","desc":"Kup mleko" }

        Q: Jutro mam spotkanie z Marianem
        A: {"tool":"Calendar","desc":"Spotkanie z Marianem","date":"2024-04-16"}
        `;
