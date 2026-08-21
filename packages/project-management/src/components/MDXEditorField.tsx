import {
    BoldItalicUnderlineToggles,
    headingsPlugin,
    listsPlugin,
    ListsToggle,
    MDXEditor,
    toolbarPlugin,
    UndoRedo
} from '@mdxeditor/editor';
import '@mdxeditor/editor/style.css';
import {
    Box,
    FormControl,
    FormHelperText,
    FormLabel,
} from '@mui/material';
import {
    Control,
    Controller,
    FieldValues,
    Path,
} from 'react-hook-form';

type MDXEditorFieldProps<T extends FieldValues> = {
    name: Path<T>;
    control: Control<T>;
    label?: string;
    required?: boolean;
    minHeight?: number;
};

export function MDXEditorField<T extends FieldValues>({
    name,
    control,
    label,
    required = false,
    minHeight = 300,
}: MDXEditorFieldProps<T>) {
    return (
        <Controller
            name={name}
            control={control}
            render={({ field, fieldState: { error } }) => (
                <FormControl fullWidth
                    error={!!error}
                    required={required}
                    sx={{ mb: 2 }}>
                    <FormLabel sx={{ mb: 1, fontWeight: 'bold' }}>{label}</FormLabel>
                    <Box sx={{
                        border: '1px solid',
                        borderColor: error ? 'error.main' : 'grey.450',
                        borderRadius: 1,
                        overflow: 'hidden',
                        '& .mdxeditor': {
                            minHeight,
                        },
                    }}>
                        <MDXEditor
                            markdown={field.value}
                            onChange={field.onChange}
                            plugins={[
                                headingsPlugin(),
                                listsPlugin(),
                                toolbarPlugin({
                                    toolbarClassName: 'my-classname',
                                    toolbarContents: () => (
                                        <>
                                            <UndoRedo />
                                            <BoldItalicUnderlineToggles />
                                            <ListsToggle />
                                        </>
                                    )
                                })
                            ]}
                        />
                    </Box>
                    {error && <FormHelperText>{error.message}</FormHelperText>}
                </FormControl>
            )}
        />
    );
}