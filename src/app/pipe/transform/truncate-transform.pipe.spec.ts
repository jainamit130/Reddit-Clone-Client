import { TruncateTransformPipe } from './truncate-html-text.pipe';

describe('TruncateTransformPipe', () => {
  it('create an instance', () => {
    const pipe = new TruncateTransformPipe();
    expect(pipe).toBeTruthy();
  });
});
