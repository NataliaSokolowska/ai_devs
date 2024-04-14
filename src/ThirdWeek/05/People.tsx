import { useCallback, useEffect, useState } from "react";
import {
  connectWithOpenApiWithFilteredInformation,
  fetchTaskData,
  submitAnswer,
} from "../../Utils/utils";
import {
  GPT_3_5_TURBO,
  TASK_NAME_03_05_PEOPLE,
} from "../../Utils/utils.constants";
import { PeopleDataJson, QuestionInterface } from "./People.interface";

const People = () => {
  const [peopleBase, setPeopleBase] = useState<PeopleDataJson[]>([]);
  const [loadingPeople, setLoadingPeople] = useState<boolean>(false);

  useEffect(() => {
    if (peopleBase.length === 0) {
      setLoadingPeople(true);
      fetch("/people/")
        .then((response) => response.json())
        .then((data: PeopleDataJson[]) => setPeopleBase(data))
        .catch((error) => console.error("Error fetching data:", error))
        .finally(() => {
          setLoadingPeople(false);
        });
    }
  }, [peopleBase.length]);

  const parseQuestion = (
    question: string
  ): { name: string; key: keyof PeopleDataJson } => {
    //regex to find name and surname
    const namePattern = /(?:^|\s)([A-Z][a-z]+) ([A-Z][a-z]+)/;
    const nameMatch = question.match(namePattern);
    let key: keyof PeopleDataJson | null = null;

    if (
      question.includes("jeść") ||
      question.includes("mieszka") ||
      question.includes("interesuje")
    ) {
      key = "o_mnie";
    } else if (question.includes("kolor")) {
      key = "ulubiony_kolor";
    } else if (question.includes("lat")) {
      key = "wiek";
    } else if (question.includes("serial")) {
      key = "ulubiony_serial";
    } else if (question.includes("film")) {
      key = "ulubiony_film";
    } else if (question.includes("postać z Kapitana Bomby")) {
      key = "ulubiona_postac_z_kapitana_bomby";
    }

    return {
      name: nameMatch ? `${nameMatch[1]} ${nameMatch[2]}` : "",
      key: key as keyof PeopleDataJson,
    };
  };

  const findAnswer = useCallback(
    async (query: QuestionInterface): Promise<string | undefined> => {
      const person = peopleBase.find(
        (p) => `${p.imie} ${p.nazwisko}` === query.name
      );
      if (person) {
        const answerHint = person[query.key];
        console.log(answerHint, "answerHint");
        return answerHint;
      } else {
        const systemData = `Jesteś znawcą językowym. Zwróć wyłącznie pełne imię bez zdrobnień i nazwisko osoby: ${query.name}, bez kropki na końcu.
        Guide###
        - zwróc pełne imię
        - zwróć nazwisko
        - zadnych zdrobnien imienia
        - bez kropki na końcu
        - zwróć w mianowniku

        Example:
        Q: Tomek Nowak
        A: Tomasz Nowak

        Q: Krysia Kowalska
        A: Krystyna Kowalska

        Q: Ani Byka
        A: Anna Byk`;
        const response = await connectWithOpenApiWithFilteredInformation(
          systemData,
          query.name,
          GPT_3_5_TURBO
        );
        const updatedPerson = peopleBase.find(
          (p) => `${p.imie} ${p.nazwisko}` === response
        );
        return updatedPerson ? updatedPerson[query.key] : undefined;
      }
    },
    [peopleBase]
  );

  useEffect(() => {
    if (peopleBase.length === 0) {
      return;
    }
    fetchTaskData(TASK_NAME_03_05_PEOPLE)
      .then(({ task, token }) => {
        if (task.question && peopleBase.length > 0) {
          const parsedQuestion = parseQuestion(task.question);
          findAnswer(parsedQuestion)
            .then((hint) => {
              if (hint) {
                const systemData = `Jesteś pomocnym asystentem. Odpowiedz na pytanie zadane przez użytkownika na podstawie informacji zawartych tutaj: ${hint}. Odpowiadaj dokładnie na pytanie: ${task.question}.`;

                connectWithOpenApiWithFilteredInformation(
                  systemData,
                  task.question,
                  GPT_3_5_TURBO
                )
                  .then((response) => {
                    console.log(response, "response");
                    submitAnswer(token, response)
                      .then(() => {
                        console.log("gites malina");
                      })
                      .catch((error) => {
                        console.error("Error submitting answer:", error);
                      });
                  })
                  .catch((error) => {
                    console.error("Error connecting with OpenAI API:", error);
                  });
              }
            })
            .catch((error) => {
              console.error("Error finding answer:", error);
            });
        }
      })
      .catch((error) => {
        console.error("Error fetching task data:", error);
      });
  }, [findAnswer, peopleBase.length]);

  return loadingPeople ? <p>Loading people...</p> : <p>People loaded!</p>;
};

export default People;
