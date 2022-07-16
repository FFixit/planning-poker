import { AllExceptionsFilter } from './error.filter';

describe('ErrorFilter', () => {
    it('should be defined', () => {
        expect(new AllExceptionsFilter()).toBeDefined();
    });
});
