import {
  boolean,
  createRelations,
  createSchema,
  id,
  object,
  reference,
  string,
  timestamp,
} from "@repo/live-state";

const organization = object("organization", {
  id: id(),
  name: string(),
  slug: string(),
  createdAt: timestamp(),
});

const organizationUser = object("organizationUser", {
  id: id(),
  organizationId: reference("organization.id"),
  userId: reference("user.id"),
  enabled: boolean().default(true),
});

const thread = object("thread", {
  id: id(),
  organizationId: reference("organization.id"),
  name: string(),
  createdAt: timestamp(),
});

const message = object("message", {
  id: id(),
  threadId: reference("thread.id"),
  author: string(),
  content: string(),
  createdAt: timestamp(),
});

const organizationRelations = createRelations(organization, ({ many }) => ({
  organizationUsers: many(organizationUser, "organizationId"),
  threads: many(thread, "organizationId"),
}));

const organizationUserRelations = createRelations(
  organizationUser,
  ({ one }) => ({
    organization: one(organization, "organizationId"),
  })
);

const threadRelations = createRelations(thread, ({ one, many }) => ({
  organization: one(organization, "organizationId"),
  messages: many(message, "threadId"),
}));

const messageRelations = createRelations(message, ({ one }) => ({
  thread: one(thread, "threadId"),
}));

export const schema = createSchema({
  // models
  organization,
  organizationUser,
  thread,
  message,
  // relations
  organizationUserRelations,
  organizationRelations,
  threadRelations,
  messageRelations,
});
