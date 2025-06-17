import { Group } from "../entities/Group";

export interface IGroupRepository {
  findById(id: string): Promise<Group | null>;
  create(name: string, members: string[]): Promise<Group>;
  addMember(groupId: string, userId: string): Promise<Group>;
  removeMember(groupId: string, userId: string): Promise<Group>;
}
