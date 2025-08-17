import {
  createParamDecorator,
  ExecutionContext,
  BadRequestException,
} from '@nestjs/common';
import { HierarchyValidator } from '../validators/hierarchy.validator';

export const ValidateHierarchy = createParamDecorator(
  async (data: string[], ctx: ExecutionContext) => {
    const request = ctx.switchToHttp().getRequest();

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const requestAny = request as any;
    const params = requestAny.params || {};
    const query = requestAny.query || {};

    // Get the hierarchy validator from the request context
    const hierarchyValidator =
      requestAny.hierarchyValidator as HierarchyValidator;

    if (!hierarchyValidator) {
      throw new BadRequestException('Hierarchy validator not available');
    }

    // Extract IDs from params and query
    const hierarchyData = {
      verticalId: params.verticalId || query.verticalId,
      batchId: params.batchId || query.batchId,
      moduleId: params.moduleId || query.moduleId,
      weekId: params.weekId || query.weekId,
      lectureId: params.lectureId || query.lectureId,
    };

    // Validate the hierarchy
    const isValid =
      await hierarchyValidator.validateFullHierarchy(hierarchyData);

    if (!isValid) {
      throw new BadRequestException(
        'Invalid hierarchy: The provided IDs do not form a valid hierarchical relationship',
      );
    }

    return hierarchyData;
  },
);
