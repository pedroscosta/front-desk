import { object, string } from "@repo/live-state";

export const issue = object("issues", {
  id: string(),
  title: string(),
});

export const schema = {
  entities: [issue],
};
