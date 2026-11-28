import type { LearnerLearningRecord, LearningExperience, OutcomeAssessment } from '../domain/learning-record.js';
import type { LearningRecordRepository } from '../application/learning-record-repository.js';
export class InMemoryLearningRecordRepository implements LearningRecordRepository {
  readonly #experiences=new Map<string,LearningExperience>(); readonly #records=new Map<string,LearnerLearningRecord>(); readonly #assessments=new Map<string,OutcomeAssessment>();
  async createExperience(item:LearningExperience):Promise<LearningExperience>{if(this.#experiences.has(item.id))throw new Error('DUPLICATE_EXPERIENCE');this.#experiences.set(item.id,item);return item;}
  async getExperience(id:string,familyId:string):Promise<LearningExperience|undefined>{const item=this.#experiences.get(id);return item?.familyId===familyId?item:undefined;}
  async listExperiences(familyId:string):Promise<readonly LearningExperience[]>{return [...this.#experiences.values()].filter(item=>item.familyId===familyId);}
  async createLearnerRecord(item:LearnerLearningRecord):Promise<LearnerLearningRecord>{if(this.#records.has(item.id))throw new Error('DUPLICATE_LEARNER_RECORD');this.#records.set(item.id,item);return item;}
  async getLearnerRecord(id:string,familyId:string):Promise<LearnerLearningRecord|undefined>{const item=this.#records.get(id);if(item===undefined)return undefined;return this.#experiences.get(item.experienceId)?.familyId===familyId?item:undefined;}
  async listLearnerRecords(familyId:string,experienceId?:string):Promise<readonly LearnerLearningRecord[]>{return [...this.#records.values()].filter(item=>(experienceId===undefined||item.experienceId===experienceId)&&this.#experiences.get(item.experienceId)?.familyId===familyId);}
  async updateLearnerRecord(item:LearnerLearningRecord,familyId:string):Promise<LearnerLearningRecord>{if(await this.getLearnerRecord(item.id,familyId)===undefined)throw new Error('LEARNER_RECORD_NOT_FOUND');this.#records.set(item.id,item);return item;}
  async createAssessment(item:OutcomeAssessment):Promise<OutcomeAssessment>{if(this.#assessments.has(item.id))throw new Error('DUPLICATE_ASSESSMENT');this.#assessments.set(item.id,item);return item;}
  async listAssessments(learnerRecordId:string,familyId:string):Promise<readonly OutcomeAssessment[]>{return (await this.getLearnerRecord(learnerRecordId,familyId))===undefined?[]:[...this.#assessments.values()].filter(item=>item.learnerRecordId===learnerRecordId);}
}
