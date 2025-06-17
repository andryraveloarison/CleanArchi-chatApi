import { IGroupRepository } from "../../domain/repositories/IGroupRepository";
import { Group } from "../../domain/entities/Group";
import GroupModel from "./models/GroupSchema";

export class GroupRepositoryImpl implements IGroupRepository {
  async findById(id: string): Promise<Group | null> {
    const group = await GroupModel.findById(id).lean();
    if (!group) return null;
    return {
      id: group._id.toString(),
      name: group.name,
      members: group.members.map((m: any) => m.toString()),
    };
  }

  async create(name: string, members: string[]): Promise<Group> {
    const group = await GroupModel.create({ name, members });
    return group.toObject();
  }

  async addMember(groupId: string, userId: string): Promise<Group> {
    const group = await GroupModel.findByIdAndUpdate(
      groupId,
      { $addToSet: { members: userId } },
      { new: true }
    ).lean();

    if (!group) throw new Error("Group not found");

    return {
      id: group._id.toString(),
      name: group.name,
      members: group.members.map((m: any) => m.toString()),
    };
  }

  async removeMember(groupId: string, userId: string): Promise<Group> {
    const group = await GroupModel.findByIdAndUpdate(
      groupId,
      { $pull: { members: userId } },
      { new: true }
    ).lean();

    if (!group) throw new Error("Group not found");

    return {
      id: group._id.toString(),
      name: group.name,
      members: group.members.map((m: any) => m.toString()),
    };
  }
}
