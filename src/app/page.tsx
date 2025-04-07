"use client";
import {
  Button,
  Card,
  Container,
  Grid,
  Modal,
  NumberInput,
  Select,
  TextInput,
  Textarea,
  Group,
  RangeSlider,
  Avatar,
  Badge,
} from "@mantine/core";
import { DateInput } from "@mantine/dates";
import { useForm, Controller } from "react-hook-form";
import { useEffect, useState } from "react";
import axios from "axios";
import "./globals.css";
import { IconX } from "@tabler/icons-react";

type Job = {
  id: number;
  title: string;
  company: string;
  location: string;
  jobType: string;
  minSalary: number;
  maxSalary: number;
  applicationDeadline: Date | null;
  description: string;
};

export default function JobDashboard() {
  const [opened, setOpened] = useState(false);
  const [jobs, setJobs] = useState<Job[]>([]);
  const [filterTitle, setFilterTitle] = useState("");
  const [filterLocation, setFilterLocation] = useState("");
  const [filterJobType, setFilterJobType] = useState("");
  const [salaryRange, setSalaryRange] = useState<[number, number]>([0, 50]);

  const { register, handleSubmit, reset, control } = useForm<Job>();

  useEffect(() => {
    fetchJobs();
  }, []);

  // const fetchJobs = async () => {
  //   try {
  //     const response = await axios.get("http://localhost:5000/job");
  //     // fetch(`${process.env.NEXT_PUBLIC_API_URL}/job`, ...)

  //     setJobs(response.data);
  //   } catch (error) {
  //     console.error("Failed to fetch jobs", error);
  //   }
  // };

  const fetchJobs = async () => {
    try {
      const response = await axios.get(`${process.env.NEXT_PUBLIC_API_URL}/job`);
      setJobs(response.data);
    } catch (error) {
      console.error("Failed to fetch jobs", error);
    }
  };
  
  // const onSubmit = async (data: Job) => {
  //   try {
  //     await axios.post("http://localhost:5000/job", data);
  //     fetchJobs();
  //     reset();
  //     setOpened(false);
  //   } catch (error) {
  //     console.error("Error submitting job:", error);
  //   }
  // };
  const onSubmit = async (data: Job) => {
    try {
      await axios.post(`${process.env.NEXT_PUBLIC_API_URL}/job`, data);
      fetchJobs();
      reset();
      setOpened(false);
    } catch (error) {
      console.error("Error submitting job:", error);
    }
  };
  
  
  // const handleDelete = async (job: Job) => {
  //   try {
  //     // Pass job.id instead of job.title
  //     await axios.delete(`http://localhost:5000/job/${job.id}`);
  //     fetchJobs(); // Refresh jobs after deletion
  //   } catch (error) {
  //     console.error("Failed to delete job:", error);
  //   }
  // };

  const handleDelete = async (job: Job) => {
    try {
      await axios.delete(`${process.env.NEXT_PUBLIC_API_URL}/job/${job.id}`);
      fetchJobs();
    } catch (error) {
      console.error("Failed to delete job:", error);
    }
  };
  
  const filteredJobs = jobs.filter((job) => {
    const withinSalary =
      job.minSalary >= salaryRange[0] && job.maxSalary <= salaryRange[1];
    return (
      job.title.toLowerCase().includes(filterTitle.toLowerCase()) &&
      job.location.toLowerCase().includes(filterLocation.toLowerCase()) &&
      job.jobType.toLowerCase().includes(filterJobType.toLowerCase()) &&
      withinSalary
    );
  });

  return (
    <div className="min-h-screen bg-gray-50">
<nav className="navbar">
  <div className="navbar-title">JobBoard</div>
  <div className="navbar-links">
    <a href="#">Home</a>
    <a href="#">Find Jobs</a>
    <a href="#">Find Talents</a>
    <a href="#">About Us</a>
    <a href="#">Testimonials</a>
  </div>
  <button className="navbar-button" onClick={() => setOpened(true)}>
    Create Job
  </button>
</nav>


      <Container size="xl" className="py-8">
        {/* Filter bar */}
        <div className="flex flex-wrap items-end gap-4 mb-6">
          <TextInput
            label="Search by Job Title"
            placeholder="e.g. Full Stack Developer"
            value={filterTitle}
            onChange={(e) => setFilterTitle(e.currentTarget.value)}
            className="flex-1 min-w-[200px]"
          />
          <TextInput
            label="Preferred Location"
            placeholder="e.g. Chennai"
            value={filterLocation}
            onChange={(e) => setFilterLocation(e.currentTarget.value)}
            className="flex-1 min-w-[200px]"
          />
          <Select
            label="Job type"
            placeholder="Select"
            data={["Full-time", "Part-time", "Contract", "Internship"]}
            value={filterJobType}
            onChange={(value) => setFilterJobType(value || "")}
            className="flex-1 min-w-[200px]"
          />
          <div className="min-w-[250px]">
            <label className="block text-sm font-medium mb-1">
              Salary Per Month
            </label>
            <RangeSlider
              value={salaryRange}
              onChange={(value) => setSalaryRange(value as [number, number])}
              min={0}
              max={50}
              step={1}
              marks={[
                { value: 0, label: "₹0L" },
                { value: 50, label: "₹50L" },
              ]}
            />
          </div>
        </div>

        {/* Jobs Grid */}
        <Grid gutter="lg">
  {filteredJobs.map((job, index) => (
    <Grid.Col span={{ base: 12, sm: 6, md: 4, lg: 3 }} key={index}>
      <Card
        shadow="sm"
        padding="lg"
        radius="md"
        withBorder
        className="h-full flex flex-col justify-between relative"
      >
        {/* Delete button */}
        <button
          className="absolute top-2 right-2 text-gray-500 hover:text-red-600"
          onClick={() => handleDelete(job)} // Pass the entire job object
        >
          <IconX size={18} />
        </button>

        {/* Job card content */}
        <div>
          <div className="flex justify-between items-center mb-2">
            <Avatar radius="xl" size="md" src="/company-icon.png" />
            <Badge color="blue" size="xs" variant="light">
              24h Ago
            </Badge>
          </div>
          <div className="font-semibold text-lg mb-1 truncate">{job.title}</div>
          <div className="text-gray-600 text-sm mb-1 truncate">{job.company}</div>
          <ul className="text-xs text-gray-700 mb-2 space-y-1">
            <li>
              <strong>Location:</strong> {job.location}
            </li>
            <li>
              <strong>Type:</strong> {job.jobType}
            </li>
            <li>
              <strong>Salary:</strong> ₹{job.minSalary} - ₹{job.maxSalary} LPA
            </li>
            <li>
              <strong>Deadline:</strong>{" "}
              {job.applicationDeadline
                ? new Date(job.applicationDeadline).toLocaleDateString()
                : "N/A"}
            </li>
          </ul>
          <p className="text-[11px] text-gray-500 truncate">
            {job.description
              .split(" ")
              .slice(0, 20)
              .join(" ") + (job.description.split(" ").length > 20 ? "..." : "")}
          </p>
        </div>
        <Button fullWidth size="sm" mt="md" radius="md">
          Apply Now
        </Button>
      </Card>
    </Grid.Col>
  ))}
</Grid>
      </Container>

      {/* Create Job Modal */}
      <Modal
  opened={opened}
  onClose={() => setOpened(false)}
  title="Create Job Opening"
  size="lg"
>
  <form onSubmit={handleSubmit(onSubmit)}>
    <div className="grid grid-cols-2 gap-4">
      <TextInput
        label="Job Title"
        withAsterisk
        placeholder="e.g. Full Stack Developer"
        {...register("title", { required: true })}
      />
      <TextInput
        label="Company Name"
        withAsterisk
        placeholder="e.g. ABC Corp"
        {...register("company", { required: true })}
      />
      <Controller
        name="location"
        control={control}
        rules={{ required: true }}
        render={({ field }) => (
          <Select
            label="Location"
            data={["Bangalore", "Hyderabad", "Chennai", "Delhi", "Mumbai"]}
            withAsterisk
            placeholder="Select a location"
            {...field}
          />
        )}
      />
      <Controller
        name="jobType"
        control={control}
        rules={{ required: true }}
        render={({ field }) => (
          <Select
            label="Job Type"
            data={["Full-time", "Part-time", "Contract", "Internship"]}
            withAsterisk
            placeholder="Select job type"
            {...field}
          />
        )}
      />
      <Controller
        name="minSalary"
        control={control}
        rules={{ required: true }}
        render={({ field }) => (
          <NumberInput
            label="Min Salary (LPA)"
            withAsterisk
            placeholder="e.g. 5"
            {...field}
            min={0}
          />
        )}
      />
      <Controller
        name="maxSalary"
        control={control}
        rules={{ required: true }}
        render={({ field }) => (
          <NumberInput
            label="Max Salary (LPA)"
            withAsterisk
            placeholder="e.g. 20"
            {...field}
            min={0}
          />
        )}
      />
 <Controller
  name="applicationDeadline"
  control={control}
  rules={{ required: true }}
  render={({ field }) => (
    <DateInput
      label="Application Deadline"
      placeholder="Pick a date"
      withAsterisk
      value={field.value}
      onChange={field.onChange}
      classNames={{
        input: 'custom-date-input', // Custom class for the input
      }}
    />
  )}
/>
    </div>
    <Textarea
      label="Job Description"
      withAsterisk
      mt="sm"
      placeholder="Write job description here"
      {...register("description", { required: true })}
    />
    <Group justify="space-between" mt="md">
      <Button variant="outline">Save Draft</Button>
      <Button type="submit" color="violet">
        Publish →
      </Button>
    </Group>
  </form>
</Modal>

    </div>
  );
}
