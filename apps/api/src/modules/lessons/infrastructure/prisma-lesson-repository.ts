import type { PrismaClient } from '../../../generated/prisma/client.js';
import type { LessonRepository } from '../application/lesson-repository.js';
import type { LessonCreationMethod, LessonVersion } from '../domain/lesson-version.js';

function isStringList(value: unknown): value is string[] {
  return Array.isArray(value) && value.every(item => typeof item === 'string');
}

function stringList(value: unknown): readonly string[] {
  if (!isStringList(value)) throw new Error('LESSON_PERSISTENCE_INVARIANT');
  return Object.freeze([...value]);
}

function creationMethod(value: string): LessonCreationMethod {
  if (value === 'manual' || value === 'ai-generated') return value;
  throw new Error('LESSON_PERSISTENCE_INVARIANT');
}

function mapLessonVersion(row: {
  id: string; lessonKey: string; familyId: string; versionLabel: string; title: string;
  subject: string; strand: string; learningLevel: string; learningGoal: string;
  successCriteria: unknown; description: string | null; materials: unknown; steps: unknown;
  adaptation: string | null; estimatedMinutes: number | null; creationMethod: string; aiProvider: string | null; aiModel: string | null;
  parentApprovedAt: Date | null; createdAt: Date;
}): LessonVersion {
  return {
    id: row.id, lessonKey: row.lessonKey, familyId: row.familyId, versionLabel: row.versionLabel,
    title: row.title, subject: row.subject, strand: row.strand, learningLevel: row.learningLevel,
    learningGoal: row.learningGoal, successCriteria: stringList(row.successCriteria),
    ...(row.description === null ? {} : { description: row.description }), materials: stringList(row.materials),
    steps: stringList(row.steps), ...(row.adaptation === null ? {} : { adaptation: row.adaptation }),
    ...(row.estimatedMinutes === null ? {} : { estimatedMinutes: row.estimatedMinutes }),
    creationMethod: creationMethod(row.creationMethod),
    ...(row.aiProvider === null ? {} : { aiProvider: row.aiProvider }),
    ...(row.aiModel === null ? {} : { aiModel: row.aiModel }),
    ...(row.parentApprovedAt === null ? {} : { parentApprovedAt: row.parentApprovedAt.toISOString() }),
    createdAt: row.createdAt.toISOString(),
  };
}

export class PrismaLessonRepository implements LessonRepository {
  constructor(private readonly prisma: PrismaClient) {}

  async create(version: LessonVersion): Promise<LessonVersion> {
    try {
      const row = await this.prisma.lessonVersion.create({ data: {
        ...version,
        successCriteria: [...version.successCriteria],
        materials: [...version.materials],
        steps: [...version.steps],
        description: version.description ?? null,
        adaptation: version.adaptation ?? null,
        estimatedMinutes: version.estimatedMinutes ?? null,
        parentApprovedAt: version.parentApprovedAt === undefined ? null : new Date(version.parentApprovedAt),
        aiProvider: version.aiProvider ?? null,
        aiModel: version.aiModel ?? null,
        createdAt: new Date(version.createdAt),
      } });
      return mapLessonVersion(row);
    } catch (error) {
      if (typeof error === 'object' && error !== null && 'code' in error && error.code === 'P2002') throw new Error('DUPLICATE_LESSON_VERSION', { cause: error });
      throw error;
    }
  }

  async get(id: string): Promise<LessonVersion | undefined> {
    const row = await this.prisma.lessonVersion.findUnique({ where: { id } });
    return row === null ? undefined : mapLessonVersion(row);
  }

  async list(familyId: string): Promise<readonly LessonVersion[]> {
    const rows = await this.prisma.lessonVersion.findMany({ where: { familyId }, orderBy: { createdAt: 'desc' } });
    return rows.map(mapLessonVersion);
  }
}
