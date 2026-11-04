/**
 * DebriefForm.tsx
 * Data entry sections of a venture evaluation debrief, following resources/venture_eval_card.md
 */

import { DeleteOutlined, PlusOutlined, QuestionCircleOutlined } from "@ant-design/icons";
import {
    Button,
    Checkbox,
    FormControlLabel,
    FormGroup,
    FormLabel,
    Grid,
    IconButton,
    Stack,
    TextField,
    Typography
} from "@mui/material";
import { useContext, useMemo } from "react";
import { Controller, useFieldArray, UseFormReturn } from "react-hook-form";
import { NavLink } from "react-router-dom";

import { Program } from "@digitalaidseattle/program-management";
import { VentureDebrief } from "../../types";
import { ChipsField, RadioField, Section, StringListField, SuggestField } from "../../../components/Fields";
import { HelpTopicContext, useHelp } from "@digitalaidseattle/core";

const SIGN_OFFS: { name: keyof VentureDebrief['sign_off'], label: string }[] = [
    { name: 'uxr', label: 'UXR' },
    { name: 'pdm', label: 'PdM' },
    { name: 'sa', label: 'SA' },
];

// distinct, sorted values used across debriefs, offered as suggestions
function vocabulary(debriefs: VentureDebrief[], pick: (debrief: VentureDebrief) => string | string[]): string[] {
    const values = debriefs.flatMap(debrief => pick(debrief) ?? []).filter(Boolean);
    return [...new Set(values)].sort((a, b) => a.localeCompare(b));
}

export const DebriefForm: React.FC<{
    form: UseFormReturn<VentureDebrief>,
    programs: Program[],
    debriefs: VentureDebrief[],
    debriefId?: string
}> = ({ form, programs, debriefs, debriefId }) => {
    const { setHelpTopic } = useContext(HelpTopicContext);
    const { setShowHelp } = useHelp();

    const {
        control,
        register,
        setValue,
        watch,
        formState: { errors },
    } = form;
    const decisions = useFieldArray({ control, name: 'decisions' });
    const artifacts = useFieldArray({ control, name: 'artifacts' });

    const ventureName = watch('venture_name');
    const programId = watch('program_id');

    const options = useMemo(() => ({
        evaluators: vocabulary(debriefs, d => d.evaluators),
        domain: vocabulary(debriefs, d => d.domain),
        capability_area: vocabulary(debriefs, d => d.capability_area),
        tech_stack: vocabulary(debriefs, d => d.tech_stack),
        solution_type: vocabulary(debriefs, d => d.solution_type),
        tags: vocabulary(debriefs, d => d.tags),
        past_evaluations: debriefs.filter(d => d.id !== debriefId).map(d => d.venture_name),
    }), [debriefs, debriefId]);


    function renderHelpButton(helpTopic: string) {
        return (
            <IconButton
                size="small"
                onClick={() => { setHelpTopic(helpTopic); setShowHelp(true) }}
                color="primary"><QuestionCircleOutlined /></IconButton>
        );
    }
    // links the debrief to the evaluation program with a matching name
    function changeVentureName(name: string) {
        const program = programs.find(p => p.name?.trim().toLowerCase() === name.trim().toLowerCase());
        setValue('venture_name', name, { shouldDirty: true, shouldValidate: !!errors.venture_name });
        setValue('program_id', program ? program.id!.toString() : null, { shouldDirty: true });
    }


    return (
        <>
            <Section title="1. Info" action={renderHelpButton("Info")} >
                <Grid container spacing={2}>
                    <Grid size={{ xs: 12, md: 6 }}>
                        <Controller
                            name="venture_name"
                            control={control}
                            rules={{ validate: value => !!value.trim() || 'Venture name is required' }}
                            render={({ field }) =>
                                <SuggestField
                                    label="Venture Name"
                                    required
                                    value={field.value}
                                    onChange={changeVentureName}
                                    options={programs.map(p => p.name ?? '')}
                                    error={errors.venture_name?.message} />
                            } />
                        {programId &&
                            <Typography variant="caption">
                                Evaluation program: <NavLink to={`/venture-evaluation/programs/${programId}`}>{ventureName}</NavLink>
                            </Typography>}
                    </Grid>
                    <Grid size={{ xs: 12, md: 6 }}>
                        <TextField
                            fullWidth
                            type="date"
                            label="Evaluation Date"
                            required
                            slotProps={{ inputLabel: { shrink: true } }}
                            {...register('evaluation_date', { required: 'Evaluation date is required' })}
                            error={!!errors.evaluation_date}
                            helperText={errors.evaluation_date?.message} />
                    </Grid>
                    <Grid size={12}>
                        <Controller
                            name="evaluators"
                            control={control}
                            render={({ field }) =>
                                <ChipsField label="Evaluator(s)" value={field.value} onChange={field.onChange} options={options.evaluators} />
                            } />
                    </Grid>
                    <Grid size={{ xs: 12, md: 6 }}>
                        <FormLabel>Sign Off</FormLabel>
                        <FormGroup row>
                            {SIGN_OFFS.map(signOff =>
                                <Controller
                                    key={signOff.name}
                                    name={`sign_off.${signOff.name}`}
                                    control={control}
                                    render={({ field }) =>
                                        <FormControlLabel
                                            label={signOff.label}
                                            control={<Checkbox checked={!!field.value} onChange={evt => field.onChange(evt.target.checked)} />} />
                                    } />
                            )}
                        </FormGroup>
                    </Grid>
                    <Grid size={{ xs: 12, md: 6 }}>
                        <Controller
                            name="outcome"
                            control={control}
                            render={({ field }) =>
                                <RadioField label="Outcome" value={field.value} onChange={field.onChange} options={['Go', 'No-go']} />
                            } />
                    </Grid>
                    <Grid size={{ xs: 12, md: 6 }}>
                        <Controller
                            name="domain"
                            control={control}
                            render={({ field }) =>
                                <SuggestField label="Domain" value={field.value} onChange={field.onChange} options={options.domain} />
                            } />
                    </Grid>
                    <Grid size={{ xs: 12, md: 6 }}>
                        <Controller
                            name="capability_area"
                            control={control}
                            render={({ field }) =>
                                <SuggestField label="Capability Area" value={field.value} onChange={field.onChange} options={options.capability_area} />
                            } />
                    </Grid>
                    <Grid size={{ xs: 12, md: 6 }}>
                        <Controller
                            name="tech_stack"
                            control={control}
                            render={({ field }) =>
                                <ChipsField label="Tech Stack" value={field.value} onChange={field.onChange} options={options.tech_stack} />
                            } />
                    </Grid>
                    <Grid size={{ xs: 12, md: 6 }}>
                        <Controller
                            name="solution_type"
                            control={control}
                            render={({ field }) =>
                                <SuggestField label="Solution Type" value={field.value} onChange={field.onChange} options={options.solution_type} />
                            } />
                    </Grid>
                </Grid>
            </Section >

            <Section title="2. Problem Statement" guidance="1–2 sentences. What problem was this venture trying to solve, and for whom?">
                <TextField fullWidth multiline minRows={2} {...register('problem_statement')} />
            </Section>

            <Section title="3. Recommendation" guidance="1–2 sentences. What did the evaluation conclude?">
                <TextField fullWidth multiline minRows={2} {...register('recommendation')} />
            </Section>

            <Section title="4. Rationale" guidance="3–5 bullets max. Why this recommendation — key evidence, not the full analysis.">
                <Controller
                    name="rationale"
                    control={control}
                    render={({ field }) =>
                        <StringListField label="Point" addLabel="Add point" value={field.value} onChange={field.onChange} />
                    } />
            </Section>

            <Section title="5. Key Decisions & Why"
                action={
                    <Button startIcon={<PlusOutlined />} onClick={() => decisions.append({ decision: '', alternative: '', rationale: '' })}>
                        Add decision
                    </Button>
                }>
                <Stack gap={2}>
                    {decisions.fields.map((row, index) =>
                        <Stack key={row.id} direction="row" gap={1} alignItems="flex-start">
                            <Grid container spacing={1} sx={{ flex: 1 }}>
                                <Grid size={{ xs: 12, md: 4 }}>
                                    <TextField fullWidth multiline size="small" label="Decision" {...register(`decisions.${index}.decision`)} />
                                </Grid>
                                <Grid size={{ xs: 12, md: 4 }}>
                                    <TextField fullWidth multiline size="small" label="Alternative considered" {...register(`decisions.${index}.alternative`)} />
                                </Grid>
                                <Grid size={{ xs: 12, md: 4 }}>
                                    <TextField fullWidth multiline size="small" label="Why this path" {...register(`decisions.${index}.rationale`)} />
                                </Grid>
                            </Grid>
                            <IconButton aria-label={`Remove decision ${index + 1}`} onClick={() => decisions.remove(index)}>
                                <DeleteOutlined />
                            </IconButton>
                        </Stack>
                    )}
                </Stack>
            </Section>

            <Section title="6. Debrief" guidance="Link to your debrief document.">
                <Controller
                    name="debrief_links"
                    control={control}
                    render={({ field }) =>
                        <StringListField label="Link" addLabel="Add link" value={field.value} onChange={field.onChange} />
                    } />
            </Section>

            <Section title="7. Reusable Artifacts Produced"
                guidance="Link out — don't paste. These live in the component library, not the card."
                action={
                    <Button startIcon={<PlusOutlined />} onClick={() => artifacts.append({ name: '', type: '', link: '' })}>
                        Add artifact
                    </Button>
                }>
                <Stack gap={2}>
                    {artifacts.fields.map((row, index) =>
                        <Stack key={row.id} direction="row" gap={1} alignItems="flex-start">
                            <Grid container spacing={1} sx={{ flex: 1 }}>
                                <Grid size={{ xs: 12, md: 4 }}>
                                    <TextField fullWidth size="small" label="Artifact" {...register(`artifacts.${index}.name`)} />
                                </Grid>
                                <Grid size={{ xs: 12, md: 3 }}>
                                    <TextField fullWidth size="small" label="Type" {...register(`artifacts.${index}.type`)} />
                                </Grid>
                                <Grid size={{ xs: 12, md: 5 }}>
                                    <TextField fullWidth size="small" label="Link" {...register(`artifacts.${index}.link`)} />
                                </Grid>
                            </Grid>
                            <IconButton aria-label={`Remove artifact ${index + 1}`} onClick={() => artifacts.remove(index)}>
                                <DeleteOutlined />
                            </IconButton>
                        </Stack>
                    )}
                </Stack>
            </Section>

            <Section title="8. Past Knowledge Applied" guidance='Required — satisfies the "100% of evaluations report applicability" KR.'>
                <Grid container spacing={2}>
                    <Grid size={{ xs: 12, md: 4 }}>
                        <Controller
                            name="searched_repository"
                            control={control}
                            rules={{ required: 'Required' }}
                            render={({ field }) =>
                                <RadioField
                                    label="Did you search the repository?"
                                    required
                                    value={field.value}
                                    onChange={field.onChange}
                                    options={['Yes', 'No']}
                                    error={errors.searched_repository?.message} />
                            } />
                    </Grid>
                    <Grid size={{ xs: 12, md: 4 }}>
                        <TextField
                            fullWidth
                            type="number"
                            label="Minutes spent before you found something or gave up"
                            slotProps={{ htmlInput: { min: 0 }, inputLabel: { shrink: true } }}
                            {...register('search_minutes', {
                                setValueAs: value => value === '' || value === null ? null : Number(value),
                                min: { value: 0, message: 'Must be zero or more' }
                            })}
                            error={!!errors.search_minutes}
                            helperText={errors.search_minutes?.message} />
                    </Grid>
                    <Grid size={{ xs: 12, md: 4 }}>
                        <Controller
                            name="past_evaluation_existed"
                            control={control}
                            rules={{ required: 'Required' }}
                            render={({ field }) =>
                                <RadioField
                                    label="Did a relevant past evaluation actually exist?"
                                    required
                                    value={field.value}
                                    onChange={field.onChange}
                                    options={['Yes', 'No', "Don't know"]}
                                    error={errors.past_evaluation_existed?.message} />
                            } />
                    </Grid>
                    <Grid size={12}>
                        <TextField
                            fullWidth
                            multiline
                            minRows={2}
                            label="Past evaluations reviewed"
                            helperText={options.past_evaluations.length > 0
                                ? `List card names / links. Existing debriefs: ${options.past_evaluations.join(', ')}`
                                : 'List card names / links.'}
                            {...register('past_evaluations_reviewed')} />
                    </Grid>
                    <Grid size={12}>
                        <Controller
                            name="applicable"
                            control={control}
                            render={({ field }) =>
                                <RadioField label="Applicable?" value={field.value} onChange={field.onChange} options={['Yes', 'No']} />
                            } />
                    </Grid>
                    <Grid size={12}>
                        <TextField
                            fullWidth
                            multiline
                            minRows={2}
                            label={watch('applicable') === 'No'
                                ? 'Why nothing applied (new domain, no precedent, etc.)'
                                : 'What was reused and how it changed this evaluation'}
                            {...register('applicability_notes')} />
                    </Grid>
                </Grid>
            </Section>

            <Section title="9. Tags"
                action={renderHelpButton("Tags")}
                guidance="Free-text supplement to the controlled fields above. New tag proposals go to the 3 Magi for monthly review.">
                <Controller
                    name="tags"
                    control={control}
                    render={({ field }) =>
                        <ChipsField label="Tags" value={field.value} onChange={field.onChange} options={options.tags} />
                    } />
            </Section>
        </>
    );
}
