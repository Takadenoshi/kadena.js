import { templateGenerate } from './template-generate';

import { Command } from 'commander';
import debug from 'debug';
import { z } from 'zod';

// eslint-disable-next-line @rushstack/typedef-var
const TemplateGenerateOptions = z.object({
  /* eslint-disable @typescript-eslint/naming-convention */
  clean: z
    .boolean({
      invalid_type_error:
        'Error: -c, --clean is optional but can only be a flag',
    })
    .optional(),
  file: z.string({
    invalid_type_error: 'Error: -f, --file must be a string',
    required_error: 'Error: -f, --file is required',
  }),
  out: z.string({
    invalid_type_error: 'Error: -o, --out must be a string',
    required_error: 'Error: -o, --out is required',
  }),
  /* eslint-enable @typescript-eslint/naming-convention */
});

export type TTemplateGenerateOptions = z.infer<typeof TemplateGenerateOptions>;

export function templateGenerateCommand(
  program: Command,
  version: string,
): void {
  program
    .command('template-generate')
    .description('Generate statically typed generators for templates')
    .option('-c, --clean', 'Clean existing template')
    .option(
      '-f, --file <file-or-directory>',
      'File or directory to use to generate the client',
    )
    .option('-o, --out <file-or-directory>', 'Output file/directory to place the generated client')
    .action((args: TTemplateGenerateOptions) => {
      debug('template-generate:action')({ args });
      TemplateGenerateOptions.parse(args);
      templateGenerate(program, version)(args);
    });
}
