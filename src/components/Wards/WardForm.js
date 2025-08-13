import { Button, TextField, Box } from '@mui/material';
import { Formik } from 'formik';
import * as Yup from 'yup';
import { createWard } from '../../api/wards';
import { toast } from 'react-toastify';

const WardForm = ({ onWardCreated }) => {
  const validationSchema = Yup.object({
    name: Yup.string().required('Ward name is required'),
    capacity: Yup.number().required('Capacity is required').min(1, 'Capacity must be at least 1'),
  });

  const handleSubmit = async (values, { setSubmitting, resetForm }) => {
    try {
      const response = await createWard(values);
      onWardCreated();
      resetForm();
      toast.success('Ward created successfully!');
    } catch (error) {
      toast.error(error.response?.data?.error || 'Failed to create ward');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <Formik
      initialValues={{ name: '', capacity: '' }}
      validationSchema={validationSchema}
      onSubmit={handleSubmit}
    >
      {({
        values,
        errors,
        touched,
        handleChange,
        handleBlur,
        handleSubmit,
        isSubmitting,
      }) => (
        <form onSubmit={handleSubmit}>
          <Box sx={{ display: 'flex', gap: 2, alignItems: 'center' }}>
            <TextField
              label="Ward Name"
              name="name"
              value={values.name}
              onChange={handleChange}
              onBlur={handleBlur}
              error={touched.name && Boolean(errors.name)}
              helperText={touched.name && errors.name}
            />
            
            <TextField
              label="Capacity"
              name="capacity"
              type="number"
              value={values.capacity}
              onChange={handleChange}
              onBlur={handleBlur}
              error={touched.capacity && Boolean(errors.capacity)}
              helperText={touched.capacity && errors.capacity}
              sx={{ width: '100px' }}
            />
            
            <Button
              type="submit"
              variant="contained"
              disabled={isSubmitting}
            >
              Create Ward
            </Button>
          </Box>
        </form>
      )}
    </Formik>
  );
};

export default WardForm;